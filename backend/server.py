from flask import Flask, request, Response
from flask_cors import CORS
import requests
import json
import time

app = Flask(__name__)
cors = CORS(app)
# app.config["DEBUG"] = True


@app.route('/getStockInfo', methods=['POST'])
def getStockInfo():
        print("request")
        print(request.json)
        request_parameters = request.get_json()
        stockSymbol = request_parameters.get("stockSymbol")

        dateTime= str(time.strftime("%c"))

        splitArr = dateTime.rsplit(' ', 1)
        print(splitArr)
        currentDateTime = splitArr[len(splitArr)-2] + ' PDT ' +  splitArr[len(splitArr)-1]

        print(dateTime)

        print(currentDateTime)
        
        url = f"https://sandbox.iexapis.com/stable/stock/{stockSymbol}/quote?token=Tpk_018b93ae93714677bc283c73c84cfa33"
        print("URLLLL")
        print(url)
        r = requests.get(url)
        print("response")
        print(r)
        print("status code")
        print(r.status_code)
        if(r.status_code == 200):
            print("json data")
            print(r.json())
            reponseData = r.json()
            print(reponseData)
            print(reponseData['companyName'])
            print(reponseData['latestPrice'])
            print(reponseData['change'])
            print(reponseData['changePercent'])
            companyName = reponseData['companyName'] + ' (' + stockSymbol + ')'
            latestPrice = reponseData['latestPrice']
            change = float(reponseData['change'])
            changePercent = float(reponseData['changePercent'])
            if(change >= 0.00):
                change = '+' + str(change)

            if(changePercent >= 0.00):
                changePercent = '(+' + str(changePercent) + '%)'
            else:
                changePercent = '(' + str(changePercent) + '%)'
            print(companyName)
            print(change)
            print(changePercent)

        data = {
            'currentDateTime' : currentDateTime, 
            'fullCompanyName' : companyName,
            'stockPrice' : latestPrice,
            'valueChanges' : change,
            'percentChanges' : changePercent
        }
        response = json.dumps(data)

        resp = Response(response, status=200, mimetype='application/json')
        return resp

app.run(host='0.0.0.0')
