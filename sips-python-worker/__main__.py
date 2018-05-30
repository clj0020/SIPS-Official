import requests
import pandas as pd
import numpy as np
import datetime

# Get Auth Token by Logging in as Admin
loginUrl = 'http://localhost:8080/users/login'
loginPostData = {'email':'testAdmin@gmail.com', 'password':'password'}
loginHeaders = {'Content-Type': 'application/json'}
loginRequest = requests.post(loginUrl, json = loginPostData, headers = loginHeaders)
authToken = loginRequest.json().get('token')

# Call machine-learner endpoint to get data
extractDataUrl = 'http://localhost:8080/machine-learner'
extractDataHeaders = { 'Content-Type': 'application/json', 'Authorization': authToken }
extractDataRequest = requests.get(extractDataUrl, headers = extractDataHeaders)

testingData = extractDataRequest.json()['testingData']

testingDataArray = []
for test in testingData:
    injury_array = []
    created_at = test['created_at']
    athleteId = test['athlete']
    for athlete in extractDataRequest.json()['athletes']:
        if (athlete['_id'] == athleteId):
            for injury in extractDataRequest.json()['injuries']:
                if (injury['athlete'] == athleteId):
                    # Add classifications based on injury dates

                    # get dates of injuries and compare them to today.
                    dt, _, us= injury['date_occurred'].partition(".")
                    dt= datetime.datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S")
                    us= int(us.rstrip("Z"), 10)
                    date = dt + datetime.timedelta(microseconds=us)
                    current_date = datetime.datetime.now()
                    difference = current_date - date # in days

                    if (difference.days <= 7):
                        injury_array.append(1)
                    elif (difference.days > 7 and difference.days <= 21):
                        injury_array.append(2)
                    elif (difference.days > 21 and difference.days <= 60):
                        injury_array.append(3)
                    else:
                        injury_array.append(0)

    test_type = test['testType']
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
            gyroscope_x = None
            gyroscope_y = None
            gyroscope_z = None

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
            magnometer_x = None
            magnometer_y = None
            magnometer_z = None

        sensor_data_array = [time, accelerometer_x, accelerometer_y, accelerometer_z, gyroscope_x, gyroscope_y, gyroscope_z, magnometer_x, magnometer_y, magnometer_z]
        test_sensor_data_array.append(sensor_data_array)

    test_sensor_numpy_array = np.asarray(test_sensor_data_array)
    if len(injury_array) == 0:
        injury_array.append(0)
        injury_numpy_array = np.asarray(injury_array)
    else:
        injury_numpy_array = np.asarray(injury_array)

    testingDataArray.append([injury_numpy_array, test_sensor_numpy_array])

dataset = np.asarray(testingDataArray)

dataset_x = []
dataset_y = []
for test in dataset:
    dataset_y.append(test[0])
    dataset_x.append(test[1:])

data_x = np.asarray(dataset_x)
data_y = np.asarray(dataset_y)

print(repr(data_y))
print(repr(data_x))

# split dataset into training and testing data
np.random.seed(0)
indices = np.random.permutation(len(dataset_x))
dataset_x_train = data_x[indices[:-10]]
dataset_y_train = data_y[indices[:-10]]
dataset_x_test = data_x[indices[-10:]]
dataset_y_test = data_y[indices[-10:]]

# Create and fit a nearest-neighbor classifier
# from sklearn.neighbors import KNeighborsClassifier
#
# knn = KNeighborsClassifier(n_neighbors=5)
# knn.fit(dataset_x_train, dataset_y_train)
# print(knn.predict(dataset_x_test))
