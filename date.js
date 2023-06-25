    module.exports = getDate;
    
    function getDate(){
        let today = new Date();
    //const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // day = "";
    // if(today.getDay()===6 || today.getDay() === 0)
    // {
    //     day = "weekend";
    // }
    // else
    // {
    //     day = "weekday";
    // }

    //day = weekday[today.getDay()];
        let options = {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
        let day = today.toLocaleDateString("en-US", options); 
        return day;      
    }