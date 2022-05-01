const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const AdminRouter = require("./routes/admin");
const ShopRouter = require("./routes/shop");

const app = express();
const port = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", AdminRouter);
app.use(ShopRouter);

// ... all valid routes and methods handled here

// 404 error page
app.use((_, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(port);

// [{"id":2554,"name":"Chandrakala Iyengar","email":"iyengar_chandrakala@zemlak-murray.com","gender":"female","status":"inactive"},{"id":2551,"name":"Chanda Pothuvaal","email":"pothuvaal_chanda@purdy.net","gender":"female","status":"inactive"},{"id":2548,"name":"Ahilya Bandopadhyay","email":"bandopadhyay_ahilya@bradtke-murazik.net","gender":"female","status":"active"},{"id":2546,"name":"Rageswari Somayaji I","email":"rageswari_i_somayaji@abernathy.net","gender":"female","status":"active"},{"id":2545,"name":"Sen. Rohan Varma","email":"sen_rohan_varma@heller.name","gender":"female","status":"active"},{"id":2544,"name":"Sucheta Nayar","email":"nayar_sucheta@mccullough.name","gender":"male","status":"inactive"},{"id":2543,"name":"Daevika Malik","email":"daevika_malik@hintz.io","gender":"female","status":"active"},{"id":2542,"name":"Indira Dhawan","email":"dhawan_indira@hammes.co","gender":"male","status":"active"},{"id":2541,"name":"Chidananda Bharadwaj","email":"bharadwaj_chidananda@reichert.org","gender":"male","status":"active"},{"id":2540,"name":"Bhagirathi Chattopadhyay","email":"bhagirathi_chattopadhyay@kozey.info","gender":"male","status":"active"},{"id":2539,"name":"Devesh Dhawan","email":"dhawan_devesh@heathcote.info","gender":"male","status":"active"},{"id":2538,"name":"Shivakari Abbott","email":"shivakari_abbott@jacobi.net","gender":"male","status":"inactive"},{"id":2537,"name":"Devajyoti Devar","email":"devar_devajyoti@brown.io","gender":"female","status":"inactive"},{"id":2536,"name":"Chidambaram Khatri DDS","email":"chidambaram_khatri_dds@greenfelder.biz","gender":"female","status":"inactive"},{"id":2535,"name":"Devi Ahluwalia","email":"ahluwalia_devi@rodriguez.name","gender":"female","status":"active"},{"id":2534,"name":"Msgr. Kama Shukla","email":"shukla_msgr_kama@bartoletti-jacobs.com","gender":"female","status":"active"},{"id":2532,"name":"Naveen Rana","email":"naveen_rana@greenholt.net","gender":"female","status":"inactive"},{"id":2531,"name":"Bhima Dwivedi","email":"bhima_dwivedi@heller-hoeger.io","gender":"male","status":"active"},{"id":2530,"name":"Baala Gill","email":"baala_gill@wolff.name","gender":"female","status":"active"},{"id":2529,"name":"Bakula Chopra","email":"chopra_bakula@crooks.name","gender":"male","status":"inactive"}]
