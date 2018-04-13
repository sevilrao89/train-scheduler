$(document).ready(function(){



    var config = {
      apiKey: "AIzaSyBZQJ8Llz_Ylrc1k_FrjetARkbzGtHh_4A",
      authDomain: "train-scheduler-a3d41.firebaseapp.com",
      databaseURL: "https://train-scheduler-a3d41.firebaseio.com/",
      storageBucket: "gs://train-scheduler-a3d41.appspot.com",
      messagingSenderId: "69468756747",
    };

  firebase.initializeApp(config);
  var db = firebase.database()
  //load data on page load db.ref

  $("#trainSchedule").submit(function(event){

     event.preventDefault()

   var trainName = $("#trainName").val()
   var destinationName = $("#destinationName").val()
   var firstTraintime = $("#firstTraintime").val()
   var frequencyTime = $("#frequencyTime").val()

   var dbObj = {
    dbTrainName: trainName,
    dbDestinationName: destinationName,
    dbFirstTrainTime: firstTraintime,
    dbFrequencyTime: frequencyTime,
   }

   db.ref().push(dbObj)



  })

  db.ref().on("value", function(snapshot){

    console.log(snapshot.val())

    for (var train in snapshot.val()){
      var dateString = moment().format('YYYY-MM-DD')
      var hours = snapshot.val()[train].dbFirstTrainTime.split(':')[0]
      hours = Number(hours)
      var minutes = snapshot.val()[train].dbFirstTrainTime.split(':')[1]
      minutes = Number(minutes)
      var frequency = Number(snapshot.val()[train].dbFrequencyTime)



    var dateYear = Number(dateString.split('-')[0]);
    var dateMonth = Number(dateString.split('-')[1]) - 1;
    var dateDay = Number(dateString.split('-')[2]);
    var m = moment(new Date(dateYear,dateMonth,dateDay,hours,minutes,0));

    for (var i = 0; i < 10000; i++){
      minutes = minutes + frequency
      m = moment(new Date(dateYear,dateMonth,dateDay,hours,minutes,0));

      var newMins = Number(m.subtract(frequency, 'm').format('m'))
      var prevStopMoment = moment(new Date(dateYear,dateMonth,dateDay,hours,newMins,0));
      var newMoment = moment();
      if(newMoment.isBetween(prevStopMoment.format('YYYY-MM-DD HH:mm'), m.format('YYYY-MM-DD HH:mm')))
      {
      var timeInMins = Number(newMoment.format('m'));
      var timeAway = m.subtract(timeInMins, 'm').format('m');
      var nextArrival = m.format('hh:mm')
      console.log(timeAway, nextArrival)
        break;
      }
    }
    }
  })
  })
