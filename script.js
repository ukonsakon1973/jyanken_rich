// ==========================================
// ゲームの状態を管理する変数
// ==========================================
let currentRound = 0;      // 現在の対戦回数（1〜10）
const totalRounds = 10;    // 最大勝負回数
let playerScore = 0;       // あなたの勝ち数
let cpuScore = 0;          // 相手の勝ち数
let isGameOver = false;    // 決着がついたかどうかのフラグ

// 相手の手に対応する画像ファイル名の配列 
const handImages = ['goo.png', 'cyoki.png', 'par.png'];

// ==========================================
// 初期化：起動時に左右の星取表へ10個のマス目を生成
// ==========================================
function initHoshitori() {
  const playerHoshitori = document.getElementById('player-hoshitori');
  const cpuHoshitori = document.getElementById('cpu-hoshitori');

  for (let i = 1; i <= totalRounds; i++) {
    playerHoshitori.innerHTML += `<div class="star-slot" id="p-star-${i}">${i}</div>`;
    cpuHoshitori.innerHTML += `<div class="star-slot" id="c-star-${i}">${i}</div>`;
  }
}
initHoshitori(); // 読み込み時に実行

// ==========================================
// 1ラウンドの進行（ボタンを押したときに実行）
// ==========================================
function playRound(playerHand) {
  if (isGameOver) return;

  currentRound++;
  
  // 相手の手をランダムに決定 (0:グー, 1:チョキ, 2:パー)
  const cpuHand = Math.floor(Math.random() * 3);
  
  const cpuHandImgEl = document.getElementById('cpu-hand-img');
  cpuHandImgEl.src = handImages[cpuHand]; 
  cpuHandImgEl.style.display = 'block';  // 画像を表示状態にする

  // 勝敗判定 (0:あいこ, 1:あなたの勝ち, 2:相手の勝ち)
  let result = 0;
  if (playerHand === cpuHand) {
    result = 0; // あいこ
  } else if (
    (playerHand === 0 && cpuHand === 1) ||
    (playerHand === 1 && cpuHand === 2) ||
    (playerHand === 2 && cpuHand === 0)
  ) {
    result = 1; // 勝ち
  } else {
    result = 2; // 負け
  }

  // 星取表の更新
  const pStar = document.getElementById(`p-star-${currentRound}`);
  const cStar = document.getElementById(`c-star-${currentRound}`);

  if (result === 1) {
    playerScore++;
    pStar.textContent = '〇'; pStar.classList.add('win');
    cStar.textContent = '●'; cStar.classList.add('lose');
    document.getElementById('round-result').textContent = '勝ち！';
  } else if (result === 2) {
    cpuScore++;
    pStar.textContent = '●'; pStar.classList.add('lose');
    cStar.textContent = '〇'; cStar.classList.add('win');
    document.getElementById('round-result').textContent = '負け…';
  } else {
    pStar.textContent = '△'; pStar.classList.add('draw');
    cStar.textContent = '△'; cStar.classList.add('draw');
    document.getElementById('round-result').textContent = 'あいこ';
  }

  // 早期決着・最終終了チェック
  checkGameEnd();

  if (!isGameOver) {
    document.getElementById('round-result').textContent += ` (${currentRound}/${totalRounds}戦)`;
  }
}

// ==========================================
// 逆転不能判定 & 10戦終了判定
// ==========================================
function checkGameEnd() {
  const remainingRounds = totalRounds - currentRound;
  
  const playerCanWin = playerScore > cpuScore + remainingRounds;
  const cpuCanWin = cpuScore > playerScore + remainingRounds;

  if (playerCanWin || cpuCanWin || currentRound === totalRounds) {
    isGameOver = true;
    
    // ボタンを無効化
    document.getElementById('btn-0').disabled = true;
    document.getElementById('btn-1').disabled = true;
    document.getElementById('btn-2').disabled = true;
    document.getElementById('reset-btn').style.display = 'block';

    // 勝者決定の処理
    if (playerScore > cpuScore) {
      document.getElementById('player-praise').style.display = 'block';
      document.getElementById('round-result').textContent = `【大勝利】 ${playerScore}勝 ${cpuScore}敗`;
    } else if (cpuScore > playerScore) {
      document.getElementById('cpu-praise').style.display = 'block';
      document.getElementById('round-result').textContent = `【完敗…】 ${playerScore}勝 ${cpuScore}敗`;
    } else {
      document.getElementById('round-result').textContent = `【引き分け】 ${playerScore}勝 ${cpuScore}敗`;
    }
  }
}

// ==========================================
// リセット処理
// ==========================================
function resetGame() {
  currentRound = 0;
  playerScore = 0;
  cpuScore = 0;
  isGameOver = false;

  document.getElementById('player-praise').style.display = 'none';
  document.getElementById('cpu-praise').style.display = 'none';
  document.getElementById('reset-btn').style.display = 'none';
  document.getElementById('round-result').textContent = '対戦待ち (1/10戦)';

  // リセット時、相手の手の画像を非表示に戻す
  const cpuHandImgEl = document.getElementById('cpu-hand-img');
  if (cpuHandImgEl) {
    cpuHandImgEl.style.display = 'none';
    cpuHandImgEl.src = '';
  }

  document.getElementById('btn-0').disabled = false;
  document.getElementById('btn-1').disabled = false;
  document.getElementById('btn-2').disabled = false;

  // 星取表のリセット
  for (let i = 1; i <= totalRounds; i++) {
    const pStar = document.getElementById(`p-star-${i}`);
    const cStar = document.getElementById(`c-star-${i}`);
    pStar.textContent = i;
    pStar.className = 'star-slot';
    cStar.textContent = i;
    cStar.className = 'star-slot';
  }
}