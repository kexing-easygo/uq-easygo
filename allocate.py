"""UQ Timetable爬虫。可批量爬取课程详细信息，如课程类型、上课时间等"""

import requests
import json
from bs4 import BeautifulSoup
import requests.utils
import os

USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) ' \
             'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'


def login_to_allocate(username, password):
    """登录myuq。需要给定用户名和密码

    Parameters:
        username(str): 用户名
        password(str): 密码
    """
    headers = {
        'User-Agent': USER_AGENT
    }
    s = requests.session()
    # 发送第一次请求，拿到AuthState参数
    content1 = s.get("https://portal.my.uq.edu.au/auth/login", headers=headers).text
    soup = BeautifulSoup(content1, "html.parser")
    auth_state = soup.find("input", attrs={"name": "AuthState"}).get("value")
    form_data = {
        "username": username,
        "password": password,
        "submit": "LOGIN",
        "AuthState": auth_state
    }
    headers["Referer"] = f"https://auth.uq.edu.au/idp/module.php/core/loginuserpass.php?AuthState={auth_state}"
    # 发送第二次登录请求，携带AuthState
    content2 = s.post(url="https://auth.uq.edu.au/idp/module.php/core/loginuserpass.php?",
                      headers=headers,
                      data=form_data).text
    soup = BeautifulSoup(content2, "html.parser")
    # 拿到第三次请求关键的SAMLResponse参数
    saml_response = soup.find("input", attrs={"name": "SAMLResponse"}).get("value")
    # 发送最后一次请求
    content3 = s.post(url="https://portal.my.uq.edu.au/auth/callback",
                      headers={
                          'User-Agent': USER_AGENT,
                          "Referer": "https://auth.uq.edu.au/"
                      },
                      data={
                          "SAMLResponse": saml_response,
                          "RelayState": "https://portal.my.uq.edu.au/auth/login"
                      })
    content4 = s.get(url="https://timetable.my.uq.edu.au/odd/student",
                     headers={
                         'User-Agent': USER_AGENT,
                         "Host": "my.uq.edu.au"
                     })
    soup = BeautifulSoup(content4.text, "html.parser")
    saml_request = soup.find("input", attrs={"name": "SAMLRequest"}).get("value")
    # 发送第五次表单请求，拿到第六次请求关键的SAMLResponse参数
    content5 = s.post(url="https://auth.uq.edu.au/idp/saml2/idp/SSOService.php",
                      headers={
                          'User-Agent': USER_AGENT,
                          "Host": "auth.uq.edu.au",
                          "Referer": "https://timetable.my.uq.edu.au/"
                      },
                      data={"SAMLRequest": saml_request})
    soup = BeautifulSoup(content5.text, "html.parser")
    saml_response = soup.find("input", attrs={"name": "SAMLResponse"}).get("value")
    # 最后一次表单请求，登录Allocate+，拿到关键参数ss
    content6 = s.post(url="https://timetable.my.uq.edu.au/odd/saml/sp/assertion",
                      headers={
                          'User-Agent': USER_AGENT,
                          "Origin": "https://auth.uq.edu.au",
                          "Referer": "https://auth.uq.edu.au/"
                      },
                      data={"SAMLResponse": saml_response}
                      )
    print(content6.text)
    current_url = content6.url
    ss = current_url.split("=")[-1]
    print("Cookie保存中")
    # 将cookies保存在本地，在cookie有效期内只需一次登陆
    cookies = requests.utils.dict_from_cookiejar(s.cookies)
    open("allocate+.json", 'w').write(json.dumps(cookies))
    print("Cookie保存完毕")
    open("ss.txt", "w").write(ss)
    print(f"ss获取成功，为{ss}")


def redirect_to_allocate(course_names):
    """
    TODO: 方法待优化
    """
    # 预加载cookie
    session = requests.session()
    if os.path.exists("allocate+.json") and os.path.exists("ss.txt"):
        cookies = json.loads(open("allocate+.json", 'r').readline().strip())
        session.cookies = requests.utils.cookiejar_from_dict(cookies)
        ss = open("ss.txt", 'r').readline().strip()
        for course_name in course_names:
            url1 = f"https://timetable.my.uq.edu.au/odd/rest/student/44576004/electivesearch/{course_name}/?ss={ss}"
            content1 = session.get(url=url1,
                                   headers={
                                       'User-Agent': USER_AGENT,
                                       "referer": f"https://timetable.my.uq.edu.au/odd/student?ss={ss}"
                                   }).json()
            keywords = list(content1.keys())
            new_dict = {keyword: {} for keyword in keywords}
            for keyword in keywords:
                print(f"获取{keyword}数据")
                url2 = f"https://timetable.my.uq.edu.au/odd/rest/student/44576004/electivesearch/{keyword}/" \
                       f"activities/?ss={ss}"

                content2 = session.get(url=url2,
                                       headers={
                                           'User-Agent': USER_AGENT,
                                           "referer": f"https://timetable.my.uq.edu.au/odd/student?ss={ss}"
                                       }).json()
                new_dict[keyword] = content2
            open(f"{course_name}.json", 'w').write(json.dumps(new_dict))
            print(f"{course_name}.json数据保存完毕")


login_to_allocate("s4457600", "Wza78485967#")
course_list = [
    "CSSE1001", "CSSE2002", "CSSE2010", "CSSE2310", "CSSE3010",
    "INFS1200", "INFS2200", "INFS3200", "INFS3202",
    "MATH1051", "MATH1052", "MATH1061", "MATH2001", "MATH2000",
    "MATH2010",
    "DECO1100", "DECO1400", "DECO2300", "DECO2500"
]
redirect_to_allocate(course_list)
