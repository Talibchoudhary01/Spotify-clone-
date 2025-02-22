console.log("Hello");
let currentSong = new Audio();
let songs;
let currFolder;
let cardContainer=document.querySelector(".cardContainer")

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


        // add timeupdate actionlistener

        currentSong.addEventListener("timeupdate",()=>{
            console.log(currentSong.currentTime, currentSong.duration); 
            document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
            
            document.querySelector(".circle").style.left= (currentSong.currentTime/currentSong.duration)*100 + "%";
        })
         
        document.querySelector(".seekbar").addEventListener("click", e=>{
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left= percent +"%";
            currentSong.currentTime=(currentSong.duration)*percent/100;
        })
    

        // add an EventListener for Hamburger
        document.querySelector(".hamburger").addEventListener("click",()=>{
            document.querySelector(".left").style.left="0%";
        })

          // add an EventListener for close
          document.querySelector(".close").addEventListener("click",()=>{
            document.querySelector(".left").style.left="-100%";
        })


        //add an EventListener on next and previous Song

        previous.addEventListener("click",()=>{
            currentSong.pause();

            console.log("Previous clicked")
            let index= songs.indexOf(currentSong.src.split("/").splice(-1)[0])
           
            if(index-1 >0){
                playMusic(songs[index-1])
            }
        })

        next.addEventListener("click",()=>{
            currentSong.pause();
            console.log("next clicked")
            let index= songs.indexOf(currentSong.src.split("/").splice(-1)[0])

            if(index  >=songs.length){
                console.log("No more next Song")
            }
           
           
            if(index+1 < songs.length){
                playMusic(songs[index+1])
            }
        })

        //add EventListener to mute icon

document.querySelector(".volumeimg").addEventListener("click",(e)=>{
    console.log(e.target);
    if(e.target.src.includes("volume.svg")){
     e.target.src = e.target.src.replace("volume.svg","mute.svg")
     currentSong.volume=0;
     document.querySelector(".range").getElementsByTagName("input")[0].value=0;
 
    }
    else{
     e.target.src = e.target.src.replace("mute.svg","volume.svg")
     currentSong.volume=.10;
     document.querySelector(".range").getElementsByTagName("input")[0].value=10;
    }
 })

        //add EventListener on Volume

        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{

            console.log("Setting value "+e.target.value+ "/100")
            currentSong.volume= parseInt(e.target.value)/100;
        })










async function getSongs(folder) {
    currFolder = folder;
    try {
        // Fetch the songs directory
        let response = await fetch(`http://127.0.0.1:3000/Projects_web/SPOTIFY_CLONE_BY_CHOUDHARY/Songs/${folder}/`);
        
        // Ensure the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response text (HTML)
        let htmlText = await response.text();

        // Create a temporary DOM element to parse the HTML
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlText;

        // Extract all <a> elements
        let anchors = tempDiv.getElementsByTagName("a");
    songs = [];

        // Extract href attributes from the anchors
        for (let i = 1; i < anchors.length; i++) {
            let element = anchors[i];
            let sont=element.href.split(`${currFolder}`)[1];
            if(sont.endsWith(".m4a")){
            songs.push(sont)//,
            }

            // songs.push(element.href.split(`${currFolder}`)[1])
            // console.log(element.href.split(`${currFolder}`)[1])

        }


        
    let songURL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songURL.innerHTML="";
    for (const song of songs) {

        let songre=song.replaceAll("%20"," ")
        let parts =songre.split("-")
           

        songURL.innerHTML = songURL.innerHTML + ` <li> 
         
                                    <img class="invert" src="music.svg" alt="cover" height="30" width="35">
                                    <div class="info">
                                        <div class="infos" > ${song}</div>
                                        <div>By Choudhary</div>
            
                                    </div>
                                    <div class="playNow">
                                        <span>play Now</span>
                                        <img class="invert" src="play.svg" alt="">
                                    </div>
                                 </li>`;
                                 
                    }



                    //add actionlistener in every songs 

                    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{

                        e.addEventListener("click", element=>{
                            // console.log(e.querySelector(".info").firstElementChild.innerHTML);

                            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
                        })

                        
                    })

        
    } catch (error) {
        console.error("Error fetching songs:", error);
        return []; // Return an empty array in case of an error
    }

    return songs;
}


const playMusic= (track,pause=false)=>{

    currentSong.src= `/Projects_web/SPOTIFY_CLONE_BY_CHOUDHARY/Songs/${currFolder}`+track;
    // let audio = new Audio("/Songs/"+track);

    if(!pause){
    currentSong.play();
    play.src="pause.svg"
    }

     songre=track.replaceAll("%20"," ")
     parts =songre.split("-")
    document.querySelector(".songinfo").innerHTML=parts[0]+"...";
    document.querySelector(".songtime").innerHTML="00:00/00:00"
}


//fetch all albums
async function displayAlbums() {
    
    let a = await fetch("http://127.0.0.1:3000/Projects_web/SPOTIFY_CLONE_BY_CHOUDHARY/Songs/");
    let response = await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
 
    let anchors = div.getElementsByTagName("a");

    let array = Array.from(anchors);

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        

        if(e.href.includes("/Projects_web/SPOTIFY_CLONE_BY_CHOUDHARY/Songs")){

            let folder=e.href.split("/").slice(-2)[0]
             
            let a = await fetch(`http://127.0.0.1:3000/Projects_web/SPOTIFY_CLONE_BY_CHOUDHARY/Songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-folder="${folder}" class="card ">
                        <div class="play">
                            <div class="circle-container">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                                    <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="currentColor" />
                                </svg>
                            </div>
                          
                            </div>
                        <img src="/Projects_web/SPOTIFY_CLONE_BY_CHOUDHARY/Songs/${folder}/cover.png" alt="card">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
`
            
        }
   
    }
    

    // Load the PlayList while the card clicked...

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
            
        e.addEventListener("click",async item=>{
           
            songs = await getSongs(`${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        })
        
    })
    
  
}


async function main() {
    await getSongs("Allbum1/");
    console.log("Songs fetched:", songs);
    playMusic(songs[2],true);



    displayAlbums();




    
    







     //First Songs
     var audio = new Audio(songs[3]);
    //  audio.play(); 

     audio.addEventListener("loadeddata",()=>{
        console.log(audio.duration,audio.currentSrc,audio.currentTime);
     })



     ///add actionlistener in play next and previous button
     play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="pause.svg"
        }
        else{
            play.src="play.svg"
            currentSong.pause();
        }

        // // add timeupdate actionlistener

        // currentSong.addEventListener("timeupdate",()=>{
        //     console.log(currentSong.currentTime, currentSong.duration); 
        //     document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)}`/`${formatTime(currentSong.duration)}`
            
        // })
     })
     

   

}



main();
