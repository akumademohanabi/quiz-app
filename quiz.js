"use strict";


// 地理クイズ問題
const data = [
    {
        question: "日本で一番面積の大きい都道府県は？",
        answers: ["北海道","東京都","沖縄県","福岡県"],
        correct: "北海道"
    },
    {
        question: "日本で一番人口密度の高い都道府県は？",
        answers: ["北海道","東京都","沖縄県","福岡県"],
        correct: "東京都"
    },
    {
        question: "岩手県の県庁所在地は？",
        answers: ["北上","花巻","一関","盛岡"],
        correct: "盛岡"
    },
];



// 出題する問題数
const QUESTION_LENGTH = 3;
// 解答時間（ms）
const ANSER_TIME_MS = 10000;
// インターバル
const INTERVAL_TIME_MS = 10;

// 解答の開始時間
let startTime = null;
// インターバルID
let intervalId = null;
// 解答中の経過時間
let elapsedTime = 0;

// 出題する問題データ
// let questions = data.slice(0, QUESTION_LENGTH);
let questions = getRandomQuestions();
// 出題する問題のインデックス
let questionIndex = 0;
// 正解数
let correctCount = 0;







/*要素一覧*/  
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');

const startButton = document.getElementById('startButton');

const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const optionButtons = document.querySelectorAll('#questionPage button');
const questionProgress = document.getElementById("questionProgress");


const resultMessage = document.getElementById("resultMessage");
const backButton = document.getElementById("backButton");

const dialog = document.getElementById('dialog');
const questionResult = document.getElementById('questionResult');
const nextButton = document.getElementById('nextButton');
console.log(dialog, questionResult, nextButton);


/*処理*/
startButton.addEventListener("click", clickStartButton);

optionButtons.forEach((button) =>{
    button.addEventListener("click", clickOptionButton);
});

nextButton.addEventListener("click", clickNextButton);
backButton.addEventListener("click", clickBackButton);


// 関数一覧

function questionTimeOver(){
    // 時間切れの場合は不正解
    questionResult.innerText = "×";
    // ダイアログのボタンテキストを設定
    if(isQuestionEnd()){
        nextButton.innerText = "結果を見る";
    }else{
        nextButton.innerText = "次の問題へ";
    }
    // ダイアログを表示
    dialog.showModal();
}

function startProgress(){
// 開始時間（タイムスタンプ）を取得
startTime = Date.now();
// インターバルを開始
intervalId = setInterval(() => {
    // 現在時刻（タイムスタンプ）取得
    const currentTime = Date.now();
    // 経過時間を計算
    const progress = ((currentTime - startTime) / ANSER_TIME_MS) * 100;
    // progressバーに経過時間を反映（表示）する
    questionProgress.value = progress;
    // 経過時間が解答時間を超えた場合、インターバルを停止する
    if(startTime + ANSER_TIME_MS <= currentTime) {
        stopProgress();
        questionTimeOver();
        return;
    }
    // 経過時間を更新（加算）する
    elapsedTime += INTERVAL_TIME_MS;
}, INTERVAL_TIME_MS);

}

function stopProgress(){
    // インターバルを停止
    if(intervalId !== null){
        clearInterval(intervalId);
        intervalId = null;
    }

}

function reset(){
    // 出題する問題をランダムに取得する
    questions = getRandomQuestions();
    // 出題する問題のインデックスを初期化する
    questionIndex = 0;
    // 正解数を初期化する
    correctCount = 0;
    // インターバルIDを初期化
    intervalId = null;
    // 解答中の経過時間を初期化
    elapsedTime = 0;
    // 開始時間を初期化
    startTime = null;
    // ボタンを有効化する
    for(let i = 0; i < optionButtons.length; i++){
        optionButtons[i].removeAttribute("disabled");
    }
}

function isQuestionEnd(){
    // 関数が最後かどうか判断する
    return questionIndex + 1 === QUESTION_LENGTH;
}

function getRandomQuestions(){
    // 出題する問題のインデックスリスト
    const questionIndexList = [];
    while(questionIndexList.length !== QUESTION_LENGTH){
        // 出題する問題のインデックスをランダムに生成する
        const index = Math.floor(Math.random() * data.length);
        // インデックスリストに含まれていない場合、インデックスリストに追加する
        if(!questionIndexList.includes(index)){
            questionIndexList.push(index);
        }
    }
    // 出題する問題リストを取得する
    const questionList = questionIndexList.map((index) => data[index]);
    return questionList;
}

function setResult(){
    // 正解率を計算する
    const accuracy = Math.floor((correctCount / QUESTION_LENGTH) * 100);
    // 正解率を表示する
    resultMessage.innerText = `正解率: ${accuracy}%`;
}

function setQuestion(){
    // 問題を取得する
    const question = questions[questionIndex];
    // 問題番号を表示する
    questionNumber.innerText = `第 ${questionIndex + 1} 問`;
    // 問題文を表示する
    questionText.innerText = question.question;
    // 選択肢を表示する
    for(let i = 0; i < optionButtons.length; i++){
        optionButtons[i].innerText = question.answers[i];
    }
}


/*イベント関連の関数一覧*/
function clickStartButton(){ //ボタンが押されたら
    // クイズをリセット
    reset();
    // 問題画面に問題を設定する
    setQuestion();
    // 解答の計測開始
    startProgress();
    //スタート画面を非表示にする 
    startPage.classList.add("hidden");
    //問題画面を表示する 
    questionPage.classList.remove("hidden");
    //結果画面を非表示する 
    resultPage.classList.add("hidden");
}

function clickOptionButton(event){
    // 解答中の経過時間を停止
    stopProgress();
    // 全ての選択肢を無効化する
    optionButtons.forEach((button) =>{
        button.disabled = true;
    });

    //解答処理を実装
    const optionText = event.target.innerText;
    //正解のテキストを取得
    const correctText = questions[questionIndex].correct;

    if(optionText === correctText){
        correctCount += 1;
        questionResult.innerText = "〇";
    }else{
        questionResult.innerText = "×";
    }

    if(isQuestionEnd()){
        nextButton.innerText = "結果を見る";
    }else{
        nextButton.innerText = "次の問題へ";
    }

    // ダイアログを表示する
    dialog.showModal();
}

function clickNextButton(){
    // 最後の問題かの確認
      if(isQuestionEnd()){
        // 正解率を設定する
        setResult();
        // ダイアログを閉じる
        dialog.close();

        //スタート画面を非表示にする 
        startPage.classList.add("hidden");
        //問題画面を非表示する 
        questionPage.classList.add("hidden");
        //結果画面を表示する 
        resultPage.classList.remove("hidden");
            
        }else{
            questionIndex++;
            // 問題画面に問題を設定する
            setQuestion();
            // インターバルIDを停止
            intervalId = null;
            // 解答中の経過時間を初期化
            elapsedTime = 0;
            // 開始時間を初期化
            // startTime = null;
            // すべての選択肢を有効化する
            for(let i = 0; i < optionButtons.length; i++){
                optionButtons[i].removeAttribute("disabled");
            }
            // ダイアログを閉じる
            dialog.close();
            // 解答の計測を開始する
            startProgress();
        }
}

function clickBackButton(){
    //スタート画面を表示する 
    startPage.classList.remove("hidden");
    //問題画面を非表示する 
    questionPage.classList.add("hidden");
    //結果画面を非表示する 
    resultPage.classList.add("hidden");
        
}



