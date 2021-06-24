import requests
from bs4 import BeautifulSoup as bs
import re
from pprint import pprint as _print
import json

suffix = "https://my.uq.edu.au"


def search_course(course_name):
    request_url = f"https://my.uq.edu.au/programs-courses/search.html?keywords=" \
                  f"{course_name}&searchType=all&archived=true"
    headers = {
        "Host": "my.uq.edu.au",
        "Referer": "https://my.uq.edu.au/programs-courses/",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/88.0.4324.96 Safari/537.36"
    }
    content = requests.get(url=request_url, headers=headers).text
    soup1 = bs(content, "html.parser")
    div = soup1.find("div", attrs={"class": "search-results"}).find("table")
    links = div.find_all("a")
    for link in links:
        if re.match(r"Semester 1, 2021", link.text.strip()):
            headers["Referer"] = request_url
            course_content = requests.get(url=f"{suffix}{link['href']}", headers=headers).content
            soup2 = bs(course_content, "html.parser")
            tr = soup2.find("tr", attrs={"class": "current"})
            profile_url = tr.find("a", attrs={"class": "profile-available"})["href"]

            content3 = requests.get(f"{profile_url}",
                                    headers={"Host": "course-profiles.uq.edu.au",
                                             "Referer": "https://my.uq.edu.au/",
                                             "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit"
                                                           "/537.36 (KHTML, like Gecko) "
                                                           "Chrome/88.0.4324.96 Safari/537.36"
                                             }).content
            soup3 = bs(content3, "html.parser")
            ul = soup3.find("div", attrs={"class": "page__header"}).find_next_sibling("div", attrs={
                "class": "row"}).find("ul")
            for li in ul.find_all("li"):
                if re.search(r"Assessment", li.a.span.text.strip()):
                    content4 = requests.get(url=li.find("a")["href"],
                                            headers={"Host": "course-profiles.uq.edu.au",
                                                     "Referer": profile_url,
                                                     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) "
                                                                   "AppleWebKit"
                                                                   "/537.36 (KHTML, like Gecko) "
                                                                   "Chrome/88.0.4324.96 Safari/537.36"
                                                     }).content

                    soup4 = bs(content4, "html.parser")
                    table = soup4.find("table")
                    if table:
                        return table


def extract_assessments(table, course_name):
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


def get_courses_by_semester(semester):
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
    # soup = bs(content, "html.parser")
    # ul = soup.find("ul", attrs={"class": "listing"})
    # div = soup.find("div", attrs={"class": "search-result"})
    # print(div)
    # for li in ul.findall("li"):
    #     print(re.findall(r"\s{4}\d{4}", li.text))

get_courses_by_semester("")