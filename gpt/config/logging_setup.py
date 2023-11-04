import datetime
import logging
import os
import sys

LOG_DIR = 'log'


def setup_logging():
    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)

    current_time = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    debug_log_file = os.path.join(LOG_DIR, f'debug_{current_time}.log')
    error_log_file = os.path.join(LOG_DIR, f'error_{current_time}.log')

    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    console_format = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_format)

    handler_info = logging.FileHandler(filename=debug_log_file, encoding='utf-8', mode='a')
    handler_info.setLevel(logging.DEBUG)
    handler_info.setFormatter(formatter)

    handler_error = logging.FileHandler(filename=error_log_file, encoding='utf-8', mode='a')
    handler_error.setLevel(logging.ERROR)
    handler_error.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(handler_info)
    logger.addHandler(handler_error)
