/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {
    Person.findOne(635).exec(function (err, model) {

        // Load the bcrypt module
        var bcrypt = require('bcrypt');

        // Generate a salt
        var salt = bcrypt.genSaltSync(10);

        var users = [
            { "username": "admin", "password": "123", "role": "admin", "id": 101 },
            { "username": "John", "password": "123", "id": 102 },
            { "username": "Alice", "password": "123", "id": 103 },
            { "username": "Bob", "password": "123", "id": 104 },
            { "username": "Jack", "password": "123", "id": 105 },
            { "username": "Tom", "password": "123", "id": 106 }
        ];

        var person = [
            {
               "title": "現金券$100起",
               "restaurant": "J-City (Kwun Tong)",
               "district": "Kowloon",
               "mall": "又一城",
               "image": "https://static5.orstatic.com/userphoto/Coupon/0/6R/001C4K42CF51497AD107D8lv.jpg",
               "coin": "10",
               "dealvaildtill": "03/12/2018",
               "quota": "5",
               "details": "憑券晚市(18:00-02:00)，堂食每枱消費滿$500即減$100、滿$750即減$150、滿$1,000即減$200，如比類推不設上限，所有套餐適用(特價食品酒水除外)。",
               "id": 1
             },
             {
               "title": "海鮮半自助晚餐65折",
               "restaurant": "Kudos",
               "district": "HKIsland",
               "mall": "時代廣場",
               "image": "https://static8.orstatic.com/userphoto/Coupon/0/6R/001C4N973DC1A7620650E5lv.jpg",
               "coin": "20",
               "dealvaildtill": "03/13/2018",
               "quota": "8",
               "details": "Kudos 海鮮半自助晚餐於晚上六時三十分至九時三十分供應，逢星期日至四成人每位$578起，小童 (5-11歲) 每位$348起；逢星期五、六、公眾假期及前夕成人每位$598起，小童 (5-11歲) 每位$368起",
               "id": 2
             },
             {
               "title": "優惠價HK$288 可盡享海鮮自助晚餐",
               "restaurant": "Sonata Western Restaurant",
               "district": "New Territories",
               "mall": "荃新天地",
               "image": "https://static6.orstatic.com/userphoto/Coupon/0/6P/001BR5C500BCD22B2A8505lv.jpg",
               "coin": "20",
               "dealvaildtill": "03/14/2018",
               "quota": "6",
               "details": "現凡星期一至日訂枱即享有8折優惠 (另凡十日前訂枱更可以*優惠價盡享自助晚餐)",
               "id": 3
             },
             {
               "title": "BOOK NOW! Enjoy 30% OFF on a la carte food item",
               "restaurant": "Brunch Club & Supper",
               "district": "HKIsland",
               "mall": "銅鑼灣世貿中心",
               "image": "https://bizstatic4.orstatic.com/userphoto/Coupon/0/5B/0011QN3ECD2C5C74C52C41lx.jpg",
               "coin": "20",
               "dealvaildtill": "03/16/2018",
               "quota": "7",
               "details": "OpenRice members who reserve a table at Brunch Club & Supper can enjoy 30% off on a la carte food item from 3pm to 10:30pm from Monday to Thursday",
               "id": 4
             },
             {
               "title": "Book and enjoy 10% Off",
               "restaurant": "LA Creperie",
               "district": "Kowloon",
               "mall": "海港城",
               "image": "https://static6.orstatic.com/userphoto/photo/9/7J5/01HK6LFD2890A6A53E3478lv.jpg",
               "coin": "50",
               "dealvaildtill": "03/20/2018",
               "quota": "30",
               "details": "Members who book La Creperie (Causeway Bay branch) through OpenRice can enjoy 10% off from 11:30am - 10:30 pm on Saturday.",
               "id": 5
             }
           ];

           var person_isfor__user_qpon = [
               {
                   "person_isFor": 3,
                   "user_qpon": 102,
                   "id": 17
                 },
                 {
                   "person_isFor": 2,
                   "user_qpon": 102,
                   "id": 18
                 },
                 {
                   "person_isFor": 3,
                   "user_qpon": 104,
                   "id": 19
                 },
                 {
                   "person_isFor": 2,
                   "user_qpon": 104,
                   "id": 20
                 }
           ];

       users.forEach(function (user) {

           if (err) {
               console.log(err);
               return;
           }
           user.password = bcrypt.hashSync(user.password, salt);

           //if you delete all the localDiskDb, you need to run it first!
           User.create(user).exec(function (err, model) { });

       });

       person.forEach(function (person) {
  
          Person.create(person).exec(function (err, model) { });
    });


   });


    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
