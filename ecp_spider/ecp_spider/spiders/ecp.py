import scrapy
import re
from bs4 import BeautifulSoup as bs
import json
import requests


def get_courses_by_semester():
    url = "https://my.uq.edu.au/programs-courses/search.html?keywords=&searchType=all&archived=true&CourseParameters" \
          "%5Bsemester%5D=2021%3A1"
    headers = {
        "Host": "my.uq.edu.au",
        "Referer": "https://my.uq.edu.au/programs-courses/search.html?keywords=semester+1&searchType=all&archived"
                   "=true&CourseParameters%5Bsemester%5D=2021:1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/88.0.4324.96 Safari/537.36"
    }
    content = requests.get(url=url, headers=headers).text
    courses = re.findall(r"[A-Z]{4}\d{4}", content)
    return courses


class EcpSpider(scrapy.Spider):
    name = 'ecp'
    prefix = "https://my.uq.edu.au"
    start_urls = []

    def __init__(self):
        super().__init__()
        self.courses = get_courses_by_semester()
        self.headers = {
            "Host": "my.uq.edu.au",
            "Referer": "https://my.uq.edu.au/programs-courses/",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/88.0.4324.96 Safari/537.36"
        }

    def start_requests(self):
        for course in self.courses:
            # self.start_urls
            url = f"https://my.uq.edu.au/programs-courses/search.html?keywords=" \
                  f"{course}&searchType=all&archived=true"
            yield scrapy.Request(url=url,
                                 headers=self.headers,
                                 callback=self.parse,
                                 meta={"referer": url,
                                       "course_name": course})

    def parse(self, response):
        content = response.text
        soup1 = bs(content, "html.parser")
        div = soup1.find("div", attrs={"class": "search-results"}).find("table")
        links = div.find_all("a")
        for link in links:
            if re.match(r"Semester 1, 2021", link.text.strip()):
                self.headers["Referer"] = response.meta["referer"]
                yield scrapy.Request(url=f"{self.prefix}{link['href']}",
                                     headers=self.headers,
                                     callback=self.parse2,
                                     meta=response.meta
                                     )

    def parse2(self, response):
        course_content = response.text
        soup2 = bs(course_content, "html.parser")
        tr = soup2.find("tr", attrs={"class": "current"})
        profile_url = tr.find("a", attrs={"class": "profile-available"})["href"]

        yield scrapy.Request(url=profile_url,
                             headers={"Host": "course-profiles.uq.edu.au",
                                      "Referer": "https://my.uq.edu.au/",
                                      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit"
                                                    "/537.36 (KHTML, like Gecko) "
                                                    "Chrome/88.0.4324.96 Safari/537.36"
                                      },
                             callback=self.parse3,
                             meta={"referer": profile_url,
                                   "course_name": response.meta["course_name"]})

    def parse3(self, response):
        content3 = response.text
        soup3 = bs(content3, "html.parser")
        ul = soup3.find("div", attrs={"class": "page__header"}).find_next_sibling("div", attrs={
            "class": "row"}).find("ul")
        for li in ul.find_all("li"):
            if re.search(r"Assessment", li.a.span.text.strip()):
                # self.headers["Referer"] = response.meta["referer"]
                yield scrapy.Request(url=li.find("a")["href"],
                                     headers=self.headers,
                                     callback=self.parse4,
                                     meta=response.meta)

    def parse4(self, response):
        content4 = response.text
        soup4 = bs(content4, "html.parser")
        table = soup4.find("table")
        if table:
            self.extract_assessments(table, response.meta['course_name'])
        else:
            print(f"{response.meta['course_name']}数据异常")

    def extract_assessments(self, table, course_name):
        trs = table.find_all("tr")
        if len(trs) > 0:
            assessments = []
            for tr in trs[1:]:
                items = tr.find_all("td")
                name = " ".join(items[0].text.split())
                weight = " ".join(items[2].text.split()).replace(" ", "").replace("%", '')
                assessments.append({"name": name,
                                    "weight": weight})
            open(f"assessments/{course_name}.json", 'w').write(json.dumps(
                {
                    "name": course_name,
                    "assessment": assessments
                }
            ))
            print(f"{course_name}作业信息录入完成")
