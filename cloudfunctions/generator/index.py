# -*- coding: utf8 -*-
import random

ACCOUNT_PREFIX = ""


def generate_easygo_account():
    return f"UQEG_{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}"


def generate_verification_code():
    return random.randint(100000, 999999)


def main(event, context):
    _type = event.get("type")
    if _type == "getVerificationCode":
        return generate_verification_code()
    elif _type == "getEasygoAccount":
        return generate_easygo_account()
    else:
        return _type