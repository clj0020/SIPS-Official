import requests
import pandas as pd
import numpy as np
import datetime
from sklearn import svm


class MachineLearner:

    def __init__(self):
        self.BASE_URL = 'http://localhost:8080'

    def run(self):
        data = self.callMachineLearner(self.BASE_URL)
        self.processTestingData(data)

    # Get JSON data from API
    def callMachineLearner(self, BASE_URL):
        # Get Auth Token by Logging in as Admin
        authToken = self.login(BASE_URL)

        # Call /machine-learner on API
        extractDataUrl = BASE_URL + '/machine-learner'
        extractDataHeaders = { 'Content-Type': 'application/json', 'Authorization': authToken }
        extractDataRequest = requests.get(extractDataUrl, headers = extractDataHeaders)
        return(extractDataRequest.json())

    # Get Auth Token by Logging in as Admin
    def login(self, BASE_URL):
        # Call /users/login endpoint on API
        loginUrl = BASE_URL + '/users/login'
        loginPostData = {'email':'testAdmin@gmail.com', 'password':'password'}
        loginHeaders = {'Content-Type': 'application/json'}
        loginRequest = requests.post(loginUrl, json = loginPostData, headers = loginHeaders)
        return(loginRequest.json().get('token'))

    # process testing data and return an array
    def processTestingData(self, data):
        testingData = data['testingData']
        athletes = data['athletes']
        injuries = data['injuries']

        testingDataArray = []
        injury_array = []
        for test in testingData:
            created_at = test['created_at']
            athleteId = test['athlete']
            test_type = test['testType']
            injury = self.getMostRecentInjuryClassification(athleteId, athletes, injuries)
            injury_array.append(injury)
            accelerometer_data = test['accelerometer_data']
            gyroscope_data = test['gyroscope_data']
            magnometer_data = test['magnometer_data']

            test_sensor_data_array = []
            for data in accelerometer_data:
                accelerometer_x = data['x']
                accelerometer_y = data['y']
                accelerometer_z = data['z']
                time = data['time']

                gyroscope_match = None
                for element in gyroscope_data:
                    if element['time'] == time:
                        gyroscope_match = element
                        break
                if (gyroscope_match != None):
                    gyroscope_x = gyroscope_match['x']
                    gyroscope_y = gyroscope_match['y']
                    gyroscope_z = gyroscope_match['z']
                else:
                    gyroscope_x = 0
                    gyroscope_y = 0
                    gyroscope_z = 0

                magnometer_match = None
                for element in magnometer_data:
                    if element['time'] == time:
                        magnometer_match = element
                        break
                if (magnometer_match != None):
                    magnometer_x = magnometer_match['x']
                    magnometer_y = magnometer_match['y']
                    magnometer_z = magnometer_match['z']
                else:
                    magnometer_x = 0
                    magnometer_y = 0
                    magnometer_z = 0

                sensor_data_array = [time, accelerometer_x, accelerometer_y, accelerometer_z, gyroscope_x, gyroscope_y, gyroscope_z, magnometer_x, magnometer_y, magnometer_z]
                test_sensor_data_array.append(sensor_data_array) # array of sensor arrays

            test_sensor_numpy_array = np.asarray(test_sensor_data_array) # array of sensor arrays
        testingDataArray.append(test_sensor_numpy_array) # array of array of sensor arrays
        print("testing_data_array:", repr(testingDataArray[0]))

        injury_numpy_array = np.asarray(injury_array) # array of floats
        print("injury_numpy_array", repr(injury_numpy_array))

    def getMostRecentInjuryClassification(self, athleteId, athletes, injuries):
        for athlete in athletes:
            if (athlete['_id'] == athleteId):
                for injury in injuries:
                    if (injury['athlete'] == athleteId):
                        # get dates of injuries and compare them to today.
                        difference = self.getDateDifference(injury['date_occurred'])

                        # Add classifications based on how long ago the injury was
                        if (difference.days <= 7):
                            # injury_array.append(1)
                            return(1)
                        elif (difference.days > 7 and difference.days <= 21):
                            # injury_array.append(2)
                            return(2)
                        elif (difference.days > 21 and difference.days <= 60):
                            # injury_array.append(3)
                            return(3)
                        else:
                            # injury_array.append(0)
                            return(4)
        # If not broken out of function yet, then no injury history so default to 0
        return(0)

    def getDateDifference(self, date_occurred):
        dt, _, us= date_occurred.partition(".")
        dt= datetime.datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S")
        us= int(us.rstrip("Z"), 10)
        date = dt + datetime.timedelta(microseconds=us)
        current_date = datetime.datetime.now()
        return(current_date - date)


machineLearner = MachineLearner()
machineLearner.run()
# dataset_x = []
# dataset_y = []
# for test in test_sensor_numpy_array:
#     dataset_y.append(test[0])
#     dataset_x.append(test[1:])
#
# print("dataset_x: ", repr(dataset_x[0][0]))
# print("dataset_y: ", repr(dataset_y))

# clf = svm.SVC()
# clf.fit(dataset_x, dataset_y)

# dataset = np.asarray(testingDataArray)
#
# print("dataset dimensions: ", dataset.ndim)
# print("dataset shape: ", dataset.shape)
# print("dataset size: ", dataset.size)
# # print("dataset: ", dataset)
#
# dataset_x = []
# dataset_y = []
# for test in dataset:
#     dataset_y.append(test[0])
#     dataset_x.append(test[1:])
#
# data_x = np.asarray(dataset_x)
# data_y = np.asarray(dataset_y)
#
# print("data x dimensions: ", data_x.ndim)
# print("data x shape: ", data_x.shape)
# print("data x size: ", data_x.size)
# print("data x: ", repr(data_x))
# print("data x single: ", repr(data_x[0][0][0]))
#
# print("data y dimensions: ", data_y.ndim)
# print("data y shape: ", data_y.shape)
# print("data y size: ", data_y.size)
# print("data y: ", repr(data_y))
# clf.predict([])

# split dataset into training and testing data
# np.random.seed(0)
# indices = np.random.permutation(len(dataset_x))
# dataset_x_train = data_x[indices[:-10]]
# dataset_y_train = data_y[indices[:-10]]
# dataset_x_test = data_x[indices[-10:]]
# dataset_y_test = data_y[indices[-10:]]

# Create and fit a nearest-neighbor classifier
# from sklearn.neighbors import KNeighborsClassifier
#
# knn = KNeighborsClassifier(n_neighbors=5)
# knn.fit(dataset_x_train, dataset_y_train)
# print(knn.predict(dataset_x_test))
