/*Firebase*/
var getrData;
var zonePull = {};
var infoPull = {};
var op_sk_on = {};
var op_ob_on = {};
var fltr_zp = {};
var rString = {};
var rAmount;
var ZoneRef,InfoRef;
var zNumb;
var znumbKey = 0;
var getNumbKey;
var dateDesc;


$(document).ready(function() {

/*===========================================================
                STAGE 1 GET DATA FROM FIREBASE
==============================================================*/
// Get a database reference to our data
var InfoRef = new Firebase("https://rrfdata.firebaseio.com/info");
var ZoneRef = new Firebase("https://rrfdata.firebaseio.com/zones");
// Attach an asynchronous callback to read the data at our posts reference
// Start Zone iteration with on click in order to append the click zone number to the "zoneheading" as well as to retrieve the zone number for later use  
var zList = function() {
        $("#rrf_zone_o ul li").on("click", function(e) {
        e.preventDefault();
        zNumb = $(this).children("li p").context.textContent;
        $('#rrf_zone_o .o_prefix h2').text("Zone " + zNumb);
        $(this).parent("ul").hide( "slow", function() {});
        });
};
// getting info date data
var iList = function() {
        $("#rrf_date_o ul li").on("click", function(e) {
        e.preventDefault();
        var dateDesc = $(this).text();
        dateCat = $(this).children("li p").context.textContent;
        $('#rrf_date_o .o_prefix h2').text(dateDesc);
        $(this).parent("ul").hide( "slow", function() {});
        console.log(dateCat);
////////
///Setting the zone and the type

////////
opT = 0;
pMulti = 1;
/// trying to filter in for the price
///var fltr_zp Filter from Zone to get Price retrieves all options, must filter more
fltr_zp = function() {
cats = zonePull[zNumb - 1].fares;
catMatch = cats.filter(function (ca) {
    return (ca.type === dateCat);
});

sortCatmatch = catMatch.filter(function (ca) {
    return (ca.type === dateCat);

}).map(function(ca) {
    return ca.price;
}).sort();
//use 0 for single result
console.log(sortCatmatch);
var basePrice = sortCatmatch[opT];

$("#rrf_cost_main h2").text("$" + basePrice * pMulti);

}; 

////////
//checking purchase area
////////
oneOpt = function(){ 
 if (  $("#rrf_cost_main h2").text() === "$undefined") {
  opT = 0;
  fltr_zp();
  } else {
    return true;
  };
};
op_ob_on = function() {
  opT = 1;
  fltr_zp();
  oneOpt();
}
//
op_sk_on = function() {
  opT = 0;
  fltr_zp();
  oneOpt();
}

/////// information feeder to helper_box element        
    if(dateCat == "Anytime") {
             $('.helper_box p').text(infoPull.anytime);
             dateCat = "anytime";
             console.log(dateCat);
             fltr_zp();
             //clear for next try          
    } else if (dateCat == "Evening Weekend") {
             $('.helper_box p').text(infoPull.evening_weekend);
             dateCat = "evening_weekend";
             console.log(dateCat);
             fltr_zp();
             //clear for next try
    } else if (dateCat == "Weekday") {
             $('.helper_box p').text(infoPull.weekday);
             dateCat = "weekday";
             console.log(dateCat);
             fltr_zp();
             //clear for next try
    } else {
            $('.helper_box p').empty();
            }                      
        });
};
/////////////

function getrData() {
    
ZoneRef.on("value", function(snapshot) {
  zonePull = snapshot.val();
    for (i=0; i < zonePull.length; i++) {
    $("#rrf_zone_o ul").append(
        '<li>' + 
        '<p>' +
        zonePull[i].zone + 
        '</p>' +
        '</li>');
    console.log( zonePull[i].zone );
    //console.log( zonePull[i].fares );
    //console.log( zonePull[i].name);
    };
});

InfoRef.on("value", function(snapshot) {
  infoPull = snapshot.val();
    $("#rrf_date_o ul").append(

        '<li>' +
        '<p>' +
        "Anytime" +
        '</p>' +
        '<span class="infoCntnt">' +
        //infoPull.anytime +
        '</span>' +
        '</li>' +
        
        '<li>' +
        '<p>' +
        "Evening Weekend" +
        '</p>' +
        '<span class="infoCntnt">' +
        //infoPull.evening_weekend +
        '</span>' +
        '</li>' +

        '<li>' +
        '<p>' +
        "Weekday" +
        '</p>' +
        '<span class="infoCntnt">' +
        //infoPull.weekday +
        '</span>' +
        '</li>' );
    
});
}
getrData();
//////////////////////// FORM ACTION
        //console.log(zNumb);
var tgl = function() {$( "#rrf_zone_o ul" ).toggle( "slow", function() {});}
var igl = function() {$( "#rrf_date_o ul" ).toggle( "slow", function() {});}
///////////////////////
$('#rrf_zone_o .o_prefix').bind("click", function() {
tgl();
zList();
});
// zNumb holds the zone number from the last click option in the list
$('#rrf_date_o .o_prefix').bind("click", function() {
igl();
iList();

});
    
/*===========================================================
                STAGE 2 Trip number to base calculation
==============================================================*/
    
    
}); //end of document ready
/// firebase  /////  end  ////
///////checking for trip amount
updatePrice = function() {
priceCheck = function(rAmount) {
rString = $("#rrf_quantity_o form input").val();
rAmount = parseInt(rString,10);
return rAmount;
}
//////check if priceCheck is unfilled or NaN
checkNaN = function() {
if(isNaN(priceCheck()) === true) {
pMulti = 1;
fltr_zp();
}else{pMulti = priceCheck()};
};

$("#rrf_quantity_o form input").each(function() {
   var elem = $(this);

   // Save current value of element
   elem.data(rAmount);

   // Look for changes in the value
   elem.bind("keyup", function(event){
      // If value has changed...
      if (elem.data(rAmount) != rAmount) {
       // Updated stored value
       //elem.data(rAmount, elem.val());
console.log(priceCheck());
pMulti = priceCheck();
fltr_zp();
checkNaN(); 
     };
   });
 });
};

///////
$("#rrf_quantity_o form").on("click",function(){updatePrice();});
