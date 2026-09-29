let players = JSON.parse(localStorage.getItem('quizPlayers')) || [];

const form = document.getElementById('scoreForm');
const nameInput = document.getElementById('playerName');
const scoreInput = document.getElementById('playerScore');
const searchInput = document.getElementById('searchPlayer');
const sortSelect = document.getElementById('sortOption');
const tbody = document.getElementById('leaderboardBody');
const emptyMsg = document.getElementById('emptyMsg');


form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = nameInput.value.trim();
    const score = parseInt(scoreInput.value);

    if(!name || isNaN(score) || score < 0){
        alert('Please enter valid name and score!');
        return;
    }

    players.push({ id: Date.now(), name, score });
    saveAndRender();
    form.reset();
});


searchInput.addEventListener('input', render);
sortSelect.addEventListener('change', render);

function saveAndRender(){
    localStorage.setItem('quizPlayers', JSON.stringify(players));
    render();
}

function render(){
    let filtered = [...players];
    const search = searchInput.value.toLowerCase();
    if(search){
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
    }

    
    const sort = sortSelect.value;
    if(sort === 'high') filtered.sort((a,b)=> b.score - a.score);
    if(sort === 'low') filtered.sort((a,b)=> a.score - b.score);
    if(sort === 'name') filtered.sort((a,b)=> a.name.localeCompare(b.name));

    tbody.innerHTML = '';
    if(filtered.length === 0){
        emptyMsg.style.display = 'block';
        return;
    }
    emptyMsg.style.display = 'none';

    filtered.forEach((player, index)=>{
        const tr = document.createElement('tr');
        if(index===0) tr.classList.add('rank-1');
        tr.innerHTML = `
            <td>#${index+1} ${index===0?'🏆':''}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
            <td><button class="delete-btn" onclick="deleteScore(${player.id})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteScore(id){
    players = players.filter(p => p.id !== id);
    saveAndRender();
}

document.getElementById('clearBtn').addEventListener('click', ()=>{
    if(confirm('Clear all data?')){
        players = [];
        saveAndRender();
    }
});

render();