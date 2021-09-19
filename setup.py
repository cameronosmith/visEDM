from setuptools import setup,find_packages

setup(
    name="visEDM",
    include_package_data=True,
    packages  = find_packages(), # Enable ./EDM Python module
    entry_points={
        'console_scripts': [
            'visEDM = visEDM:run',
        ],
    },
)

