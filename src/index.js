const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const userIdMiddleware = require('./app/middleware/sessionUser');
const {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold,} = require("@google/generative-ai");
const flash = require('connect-flash');
const Handlebars = require('handlebars');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 3000;
const route = require('./routes/index.js');
const db = require('./config/db/index.js')

// Connect Database
db.connect()

// HTTP logger
app.use(morgan('combined'))

// Cấu hình express-session
app.use(session({
    secret: 'aQw09^&2Qmz!3#xT~1L5p4d',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Google-Auth
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

// Override with POST having ?_method=PUT
app.use(methodOverride('_method'))

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Template engine
app.engine('handlebars', engine(
    {
        defaultLayout: path.join(__dirname, 'resources/views/layouts/main.handlebars'),
        layoutsDir: path.join(__dirname, "resources/views/layouts"),
        partialsDir: path.join(__dirname,  "resources/views/partials"),
        helpers: {
            nl2br: function(text) {
                return new Handlebars.SafeString(text.replace(/\\n/gm, '<br>'));
            },
            limitedText: function(text) {
                let replacedText = text.replace(/\\n/gm, '<br>');
                let lines = replacedText.split('<br>');
                if (lines.length > 2) {
                    lines = lines.slice(0, 2);
                    lines[1] = lines[1].replace(/\\n/gm, '');
                    lines.push("...");
                }
                return new Handlebars.SafeString(lines.join('<br>'));
            },
            statusString: function(a) {
                if (a === 1) {
                    return "Đã duyệt";
                }
                else if (a === 0) {
                    return "Chưa duyệt";
                }
                else {
                    return "Khác";
                }
            }
        }
    }
));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views')); 

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

// Cấu hình flash middleware
app.use(flash());

// Sử dụng flash messages trong views
app.use((req, res, next) => {
  res.locals.successMessages = req.flash('Success');
  res.locals.errorMessages = req.flash('Error');
  next();
});

async function runChat(userInput) {
    const apiKey = 'AIzaSyA7ZPopZ7gRdFx058pxv2tKAveNVywfMyE';
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        systemInstruction: "Chỉ trả lời phản hồi bằng tiếng Việt \nBạn là TroGPT, 1  chatbot tiếng việt được sử dụng để hỗ trợ người dùng khi đang sử dụng trang web OneHouse cho thuê nhà trọ của tôi. Công việc của bạn là điều hướng người dùng, trả lời các câu hỏi liên quan và giúp người dùng có trải nghiệm website tốt nhất.\nHãy bắt đầu giới thiệu trang web Onehouse. Sau đó, hãy hỏi người dùng về các nhu cầu tìm phòng trọ của họ như là giá cả, vị trí ở quận mấy, nội thất như thế nào. Hỗ trợ họ tìm kiếm phòng nhanh nhất và tiện lợi nhất dựa trên database của trang web và dựa trên nhu cầu của người dùng.\nPhạm vi tìm kiếm nhà trọ có thể thu hẹp lại trong phạm vi thành phố Hồ Chí Minh, Việt Nam. Bạn có thể kể những khu vực quận mà database có phòng trọ đó là Quận 1, Quận 10 và Quận 3. \nSau đây là danh sách 1 số phòng trọ: \n    -Căn studio tại đường Nguyễn Cảnh Chân, Quận 1, TP. Hồ Chí Minh. Giá thuê 5.5 triệu . Studio rộng rãi thoáng mát, full nội thất.\n    -Căn hộ studio tại đường Hoàng Sa, Quận 1, TP. Hồ Chí Minh. Giá thuê căn hộ 5.5 triệu . Studio cửa sổ lớn, rộng và thoáng. trang bị full nội thất.\n    -Căn hộ tại đường Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh. Căn hộ sang trọng giá 8.5 triệu . Có thang máy, hầm xe. Hợp đồng dài hạn,.. \n    -Căn hộ 2 phòng ngủ tại Hoàng Dư Khương, Quận 10, TP. Hồ Chí Minh. Giá thuê căn hộ 9.5 triệu. Hai phòng ngủ tách bếp, ban công lớn, rộng thoáng, trang bị full nội thất. \n    -Căn hộ studio tại đường 3 tháng 2, Quận 10, TP. Hồ Chí Minh. Giá thuê căn hộ 6.5 triệu. Studio ban công cửa sổ thoáng mát, Full nội thất đầy đủ. \n Hãy trả lời ngắn gọn, xúc tích. Phản hồi của bạn chỉ cần từ 2-3 câu, tối đa là 5 câu. Khi được hỏi về các trang web, không được gợi ý về chúng mà hãy nói về điểm mạnh và tại sao user nên sử dụng OneHouse. ",
    });
    
    const generationConfig = {
        temperature: 0.5,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };
    
    const safetySettings = [
        {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];
    const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [
        ],
      });
    
      const result = await chatSession.sendMessage(userInput);
      console.log(result.response.text());
      return result.response.text();
    }
app.post('/chat', async (req, res) => {
        try {
        const userInput = req.body?.userInput;
        console.log('incoming /chat req', userInput);
        if (!userInput) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
    
        const response = await runChat(userInput);
        res.json({ response });
        } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
// Sử dụng middleware để thêm userId vào req
app.use(userIdMiddleware);

//Use flash
app.use(flash());

// Routes & Controllers
route(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
