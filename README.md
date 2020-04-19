# COVID-19-vs-Pollution

In this project we decided to look if there's any relation between the COVID-19 cases (lockdowns) and the air pollution in the USA.

We wrote the code that pulls the json COVID-19 in the USA data from the https://covidtracking.com/api/states/daily and convert it to the csv file. 
We cleaned up the the data to contain the date, number of positive cases and the states and loaded it to the sqlite db. 

Further on, we have created an app.py to load the data by going to the api endpoint and visualize it with the map. By using the scroller on the map we could track how number of positive cases has grown over time, in particular every states color is changing to a darker color the higher the number of positvie cases grew. 

We have also created a graph that showed the same data giving a comparison day by day in each state when hovering over the lines. 

The bubble map has an automated play button that when clicked by the user goes day by day and the bubbles grow over each state that had positive cases based on how the number grew.

To show the impact on the air pollution we have pulled the pictures of comparison that showed the amount of air pollution over the certain states and cities on March, 2019 and March, 2020. Adding a slider to it made it an interactive visual that helps to see the impact of the lockdown on the air pollution. 

Finally, we have put all the visuals together to a responsive website that contained all of the mentioned above interactvie graphs and maps. 
