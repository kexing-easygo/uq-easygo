import requests
import json
from bs4 import BeautifulSoup
import requests.utils
import re
import os

USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) ' \
             'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'


def login(username, password):
    """登录 UQ Blackboard。需要给定用户名和密码

    Parameters:
        username(str): 用户名
        password(str): 密码
    """
    headers = {
        'User-Agent': USER_AGENT
    }
    s = requests.session()
    # 发送第一次请求，拿到AuthState参数
    content1 = s.get("https://learn.uq.edu.au/", headers=headers).text
    soup = BeautifulSoup(content1, "html.parser")
    auth_state = soup.find("input", attrs={"name": "AuthState"}).get("value")
    # username = "s4457600"
    # password = "Wza78485967#"
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
    s.post(url="https://learn.uq.edu.au/auth-saml/saml/SSO/alias/_149_1",
           headers={
               'User-Agent': USER_AGENT,
               "Referer": "https://auth.uq.edu.au/"
           },
           data={"SAMLResponse": saml_response})
    print("Cookie保存中")
    # 将cookies保存在本地，在cookie有效期内只需一次登陆
    cookies = requests.utils.dict_from_cookiejar(s.cookies)
    open("cookie.json", 'w').write(json.dumps(cookies))
    print("Cookie保存完毕")


def redirect_to_blackboard():
    """使用cookie重定向到blackboard界面
    TODO: 方法待优化
    """
    # 预加载cookie
    session = requests.session()
    if os.path.exists("cookie.json"):
        cookies = json.loads(open("cookie.json", 'r').readline().strip())
        session.cookies = requests.utils.cookiejar_from_dict(cookies)

    return session


def announcements_spider(course_name):
    """获取给定课程的所有announcements
    TODO: 需要一个手段保存所有announcement
    """
    session = redirect_to_blackboard()
    content = session.get(url="https://learn.uq.edu.au/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_1_1",
                          headers={
                              'User-Agent': USER_AGENT,
                              "Referer": "https://auth.uq.edu.au/"
                          }).text
    soup = BeautifulSoup(content, "html.parser")
    divs = soup.find_all("div", attrs={"class": "menu-item"})
    for div in divs:
        courses = div.find_all("li")
        for course in courses:
            # 课程名是搜索用的关键字，不能是exam
            if all([re.search(course_name, course.text),
                    not re.search(r"Exam|exam", course.text)]):
                course_href = course.find("a").get("href").strip()
                # 提取course id
                course_id = course_href.split("%3D")[-2].split("%")[0].strip()
                url = f"https://learn.uq.edu.au/" \
                      f"webapps/blackboard/execute/announcement?method=search&context=course_entry" \
                      f"&course_id={course_id}&handle=announcements_entry&mode=view"
                # 查看该门课的announcement
                announcement = session.get(url=url,
                                           headers={
                                               'User-Agent': USER_AGENT,
                                               "Referer": "https://learn.uq.edu.au/"
                                                          "webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_1_1"
                                           }).text

                soup = BeautifulSoup(announcement, "html.parser")
                items = soup.find_all("div", attrs={"class": "vtbegenerated"})
                for item in items:
                    print(item.text)


announcements_spider("ELEC4400")
