import ijson
import json
import random
import string
import time
from typing import  List, BinaryIO
from uuid import uuid4

from src.models.task_validator import LazyLoadedNode, Task, TaskBuilder, TaskList
from src.constants import DATA_DIR

task_tree = None

def process_json_file(file_content: BinaryIO) -> LazyLoadedNode:
    global task_tree
    task_tree = TaskList()
    root_tasks = []
    tasks_stack: list[TaskBuilder] = []
    childs_dicts: list[dict[str,Task]] = []
    objects = ijson.parse(file_content)
    for prefix, event, value in objects:
        if event == "start_map" and prefix.endswith("tasks.item"):
            # for now we just know we have a TaskList container to fulfill
            task_builder = TaskBuilder()
            tasks_stack.append(task_builder)
        elif event == "boolean" and prefix.endswith("isDone"):
            tasks_stack[-1].parsed_isDone = value
        elif event == "string" and prefix.endswith("name"):
            tasks_stack[-1].parsed_name = value
        elif event == "string" and prefix.endswith("id"):
            tasks_stack[-1].parsed_id = value
        elif event == "end_map" and tasks_stack:
            task = tasks_stack[-1].buildTask()
            # links task childs
            task["tasks"] = [x["child"] for x in childs_dicts if x["parent"] == task["id"]]
            childs_dicts = [x for x in childs_dicts if x["parent"] != task["id"]]
            # if has a parent, add it to known childs
            if len(tasks_stack) >= 2:
                # TODO implement id unicity check to avoid messing with tree
                childs_dicts.append(dict(parent=tasks_stack[-2].parsed_id,child=task))
            else:
                root_tasks.append(task)
            tasks_stack.pop()
    task_tree.tasks = root_tasks
    lazy_loaded_ids :List[str] = []
    limited_tree = load_first_levels(lazy_loaded_ids)
    lazyNode = LazyLoadedNode(tree=limited_tree, lazyLoadedIds=lazy_loaded_ids)
    return lazyNode.to_dict()

def load_tasks_chunk(task: Task, lazy_loaded_ids: List[str], max_depth:int) -> Task:
    """
        Provides a copy of the task with the given depth childs.
        :param task: the task node to return, make sure to provide a copy of the original
        :param lazy_loaded_ids: list of the leaf tasks with unloaded childs
        :param max_depth: depth of the task childs tree to return
        :return task truncated at max_depth depth.
    """
    if max_depth == 0:
        leaf = dict(task)
        # if has still child, save as lazy loaded
        if leaf["tasks"]:
            leaf["tasks"] = []
            lazy_loaded_ids.append(leaf["id"])
        return leaf
    task["tasks"] = [load_tasks_chunk(dict(subtask), lazy_loaded_ids, max_depth - 1) for subtask in task["tasks"]]
    return task

def load_first_levels(lazy_loaded_ids: List[str]):
    global task_tree
    task_tree_limited = dict()
    task_tree_limited["tasks"] = [load_tasks_chunk(dict(task), lazy_loaded_ids, 1) for task in task_tree.tasks]
    return task_tree_limited

def write_file():
    MAX_DEPTH = 5
    MAX_CHILD_TASKS = 10
    MAX_NAME_LENGTH = 10
    NUM_TASKS = 2
    def generateTask(tasks:list[Task] = []):
        return Task(
            id=str(uuid4()),
            name="".join(random.choices(string.ascii_lowercase, k=MAX_NAME_LENGTH)), 
            isDone=random.choice([True, False]),
            tasks=tasks)
    
    def generate_tasklist(depth=0):
        if depth == MAX_DEPTH:
            return generateTask()
        else:
            return generateTask([generate_tasklist(depth+1) for _ in range(random.randint(1, MAX_CHILD_TASKS))])
    
    tasks = [generate_tasklist() for _ in range(NUM_TASKS)]
    tasklist = TaskList(tasks=tasks)
    json_str = json.dumps(tasklist.to_dict())
    with open(f'{DATA_DIR}/tasklist{time.strftime("%Y%m%d-%H%M%S")}.json', "w") as f:
        f.write(json_str)

def is_instance(task: Task, task_id: str):
    for t in task["tasks"]:
        if t["id"] == task_id:
            return t
        return is_instance(t, task_id)

def load_task_childs(task_id: str) -> LazyLoadedNode:
    global task_tree
    task = None
    lazy_loaded_ids = []
    for t in task_tree.tasks:
        if t["id"] == task_id:
            task = t
            break
        task = is_instance(t, task_id)
        if task:
            break
    if not task:
        return None
    limited_task = load_tasks_chunk(dict(task),lazy_loaded_ids,1)
    lazyNode = LazyLoadedNode(tree=limited_task, lazyLoadedIds=lazy_loaded_ids)
    return lazyNode.to_dict()