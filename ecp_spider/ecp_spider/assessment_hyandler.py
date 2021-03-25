import os
import json
import re

dir_path = "../assessments"
files = [os.path.join(dir_path, file) for file in os.listdir("../assessments")]
for file in files:
    f = open(file, 'r+')
    content = json.loads(f.read())
    name = content["name"]
    for item in content["assessment"]:
        weight = item["weight"]
        try:
            weight = float(weight)
        except Exception:
            # print(f"{name}中的{weight}属于PF或其他类型")
            if re.match("^\d+", weight):
                if "(" not in weight:
                    weight = re.sub(r"Individual", r"(Individual)", weight)
                    weight = re.sub(r"Team", r"(Team)", weight)
                    weight = re.sub(r"Group", r"(Group)", weight)
                if "or" in weight:
                    weight = re.sub("or", "/", weight)
                else:
                    weight = re.sub(r"\s+", "", weight)
                print(weight)
            # if "Team" in weight:
            #     weight = re.sub(r"Team", "(Team)", weight)
            # elif "Pass" in weight or "Fail" in weight:
            #     weight = re.sub(r".*", "Pass/Fail", weight)
        item["weight"] = weight
    f = open(file, 'w+')
    f.write(json.dumps(content))
    f.close()