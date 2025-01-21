const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

// 游戏设置
const gridSize = 20; // 每个格子的大小
const tileCount = canvas.width / gridSize; // 每行/列的格子数

// 蛇的初始状态
let snake = [{ x: 10, y: 10 }]; // 蛇的初始位置
let direction = { x: 0, y: 0 }; // 蛇的移动方向
let food = { x: 5, y: 5 }; // 食物的初始位置
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // 从本地存储获取最高分数

// 音效
const eatSound = new Audio("鸡.mp3"); // 吃到食物时播放
const gameOverSound = new Audio("姬霓太美.mp3"); // 游戏结束时播放

// 获取分数显示元素
const currentScoreElement = document.getElementById("current-score");
const highScoreElement = document.getElementById("high-score");

// 获取颜色选择器
const snakeColorSelect = document.getElementById("snake-color");
let snakeColor = "green"; // 默认颜色为青色

// 获取速度调节滑块
const speedSlider = document.getElementById("speed-slider");
let moveInterval = 100; // 默认速度

// 监听颜色选择器变化
snakeColorSelect.addEventListener("change", event => {
    snakeColor = event.target.value; // 更新蛇的颜色
});

// 监听速度调节滑块变化
speedSlider.addEventListener("input", event => {
    moveInterval = 300 - event.target.value; // 滑块值越小，速度越快
});

// 更新分数显示
function updateScoreDisplay() {
    currentScoreElement.textContent = `当前分数: ${score}`;
    highScoreElement.textContent = `最高分数: ${highScore}`;
}

// 监听键盘事件
document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// 监听触控按钮点击事件
document.getElementById("up").addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: -1 };
});
document.getElementById("down").addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: 1 };
});
document.getElementById("left").addEventListener("click", () => {
    if (direction.x === 0) direction = { x: -1, y: 0 };
});
document.getElementById("right").addEventListener("click", () => {
    if (direction.x === 0) direction = { x: 1, y: 0 };
});

// 触摸滑动控制
let startX, startY;
canvas.addEventListener("touchstart", event => {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
});

canvas.addEventListener("touchend", event => {
    const touch = event.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;

    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction.x === 0) direction = { x: 1, y: 0 }; // 向右
        else if (diffX < 0 && direction.x === 0) direction = { x: -1, y: 0 }; // 向左
    } else {
        if (diffY > 0 && direction.y === 0) direction = { x: 0, y: 1 }; // 向下
        else if (diffY < 0 && direction.y === 0) direction = { x: 0, y: -1 }; // 向上
    }
});

// 游戏循环
let lastUpdateTime = 0;

function gameLoop(currentTime) {
    // 控制蛇的移动速度
    if (currentTime - lastUpdateTime >= moveInterval) {
        lastUpdateTime = currentTime;

        // 更新蛇的位置
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // 边界检查
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOverSound.play(); // 播放游戏结束音效
            alert("游戏结束！你的得分是：" + score);
            resetGame(); // 重置游戏
            return; // 结束当前循环
        }

        // 检测是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            eatSound.play(); // 播放吃到食物音效
            food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
            score++; // 增加分数
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore); // 更新本地存储的最高分数
            }
            updateScoreDisplay(); // 更新分数显示
        } else {
            snake.pop(); // 如果没有吃到食物，移除蛇的尾部
        }

        // 将新头部添加到蛇的前面
        snake.unshift(head);
    }

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇
    snake.forEach(segment => {
        ctx.fillStyle = snakeColor; // 使用选择的颜色
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // 绘制食物
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 重置游戏
function resetGame() {
    snake = [{ x: 10, y: 10 }]; // 重置蛇的初始位置
    direction = { x: 0, y: 0 }; // 重置方向
    food = { x: 5, y: 5 }; // 重置食物位置
    score = 0; // 重置分数
    updateScoreDisplay(); // 更新分数显示
}

// 启动游戏
updateScoreDisplay(); // 初始化分数显示
requestAnimationFrame(gameLoop); // 启动游戏循环
