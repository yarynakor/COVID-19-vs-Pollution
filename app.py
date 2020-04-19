from flask import Flask, jsonify, render_template,request
import sqlite3
import plotly.express as px
import pandas as pd
import numpy as np
import json
from flask_cors import CORS, cross_origin

app = Flask(__name__)

CORS(app)


@app.route("/")
def index():
    return render_template('map.html')

@app.route("/plotly")
def plotly():
    conn = sqlite3.connect('covid.db')
    #Creates the plotly object.
    corona_df = pd.read_sql('SELECT * FROM covid', con=conn) 

    fig = px.line(corona_df, x='Date', y='Positive_Cases', color='State')
    fig.update_xaxes(tickangle=90)
    fig.update_layout(
    title = 'COVID-19 Confirmed Cases over Time',
    xaxis_tickformat = '%m/%d/%y')
    
    #Returns the fig object with the data and layout 
    return jsonify(json.loads(fig.to_json()))

@app.route('/data')
# @cross_origin()
def covid():
    conn = sqlite3.connect('covid.db')
    corona_df=pd.read_sql('SELECT * FROM covid', con=conn)
    data=corona_df.to_json(orient='table')
    return jsonify(json.loads(data))
    

if __name__ == "__main__":
    app.run(debug=True)
