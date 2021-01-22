//only want the contents to load wonce all the html has been writen alt put script at end of html
document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let isGameOver = false
    //speed add
    let platformCount = 5
    let platforms = []
    let score = 0
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    //gravity add
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let acc = 1;

    class Movement{
        

    }
    
    //object that stores velocity and objects in space
    //how long between last fram and this frame
    //work out change in velocity

    class Platform {
        constructor(newPlatBottom){
            this.bottom = newPlatBottom
            this.left = Math.random()*315
            this.visual = document.createElement('div')
            
            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }

    }

    function createPlatforms(){
        //the original plaforms in the game
        for (let i = 0; i<platformCount; i++){
            let platGap = 600/platformCount;
            let newPlatformBottom = 100 + i*platGap
            let newPlatform = new Platform(newPlatformBottom)
            platforms.push(newPlatform)
            //console.log(platforms)
        }
    }
    
    function movePlatforms(){
        if (doodlerBottomSpace > 200){
            platforms.forEach(platform => {
                //plafroms moving down
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'
            
                if (platform.bottom <10){
                    //remove platforms off screen
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')//so we visually don't see it
                    platforms.shift() //gets rid of first item in array
                    //adjust score for removed platform
                    score++;
                    //add new plaform at the top
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function createDoodler()
    {
        //put something into grid
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
        
    }

    function jump(){
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function (){
            doodlerBottomSpace += 20 //change with for relaistic gravity
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > (startPoint+200)){
                fall()
                isJumping = false
            }
        }, 30)
    }

    function fall(){
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function (){
            doodlerBottomSpace -=5 //change for realistic gravity
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0){
                gameOver()
            }
            platforms.forEach(platform => {
                if(
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15)&&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85))&&
                    !isJumping
                ){
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    jump()
                    
                    isJumping = true
                }
                
            })
        }, 30)
    }

    function moveLeft(){
        if (isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        clearInterval(leftTimerId)
        isGoingLeft = true
        leftTimerId = setInterval(function (){
            if (doodlerLeftSpace >= 0){
                doodlerLeftSpace -=5*acc //change for arc /\
                doodler.style.left = doodlerLeftSpace + 'px'
            }else{
                //clearInterval(leftTimerId)
                moveRight()
            }
        }, 30)
        setTimeout(() => {clearInterval(leftTimerId)}, 1000)
    }

    function moveRight(){
        if (isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        clearInterval(rightTimerId)
        rightTimerId = setInterval(function (){
            if (doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5*acc //change for arc /\
                doodler.style.left = doodlerLeftSpace + 'px'
            }else{
                //clearInterval(rightTimerId)
                moveLeft()
            }
        }, 30)
        setTimeout(() => {clearInterval(rightTimerId)}, 1000)
    }

    function moveStraight(){
        isGoingLeft = false
        isGoingRight = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function control(e){
        if (e.key === "ArrowLeft"){
            moveLeft()
        }else if (e.key === "ArrowRight"){
            moveRight()
        }else if (e.key === "ArrowUp"){
            moveStraight()
        }
    }

    function gameOver(){
        console.log('game over')
        isGameOver = true
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score;
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function start(){
        if (!isGameOver){
            createPlatforms()
            createDoodler()
            //time in ms
            setInterval(movePlatforms, 30)
            //clearInterval(leftTimerId)
            //clearInterval(rightTimerId)
            jump(startPoint)
            document.addEventListener('keyup', control)
        }
    }
    //attach to button
    start()
})