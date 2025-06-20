// Array untuk menyimpan antrian proses
let processes = [];

// Fungsi untuk menambahkan proses ke antrian
function addProcess() {
    const processName = document.getElementById('processName').value.trim();
    const burstTime = parseInt(document.getElementById('burstTime').value);
    const nameError = document.getElementById('nameError');
    const timeError = document.getElementById('timeError');
    const queueList = document.getElementById('queueList');

    // Reset pesan error
    nameError.style.display = 'none';
    timeError.style.display = 'none';

    // Validasi input
    if (!processName) {
        nameError.textContent = 'Nama proses tidak boleh kosong!';
        nameError.style.display = 'block';
        return;
    }
    if (isNaN(burstTime) || burstTime < 1) {
        timeError.textContent = 'Burst time harus angka positif!';
        timeError.style.display = 'block';
        return;
    }

    // Tambahkan proses ke antrian
    processes.push({ name: processName, burstTime: burstTime });
    document.getElementById('processName').value = '';
    document.getElementById('burstTime').value = '';
    document.getElementById('burstTime').focus(); // Fokus ke input berikutnya

    // Tampilkan antrian
    updateQueueDisplay();
    queueList.innerHTML += '<p class="success">Proses berhasil ditambahkan!</p>';
    setTimeout(() => {
        queueList.lastChild.remove(); // Hapus pesan sukses setelah 2 detik
    }, 2000);
}

// Fungsi untuk mereset antrian
function resetQueue() {
    processes = [];
    updateQueueDisplay();
    document.getElementById('resultBody').innerHTML = '';
    document.getElementById('summary').innerHTML = '';
    document.getElementById('ganttChart').innerHTML = '';
    document.getElementById('queueList').innerHTML += '<p class="success">Antrian telah direset!</p>';
    setTimeout(() => {
        document.getElementById('queueList').lastChild.remove();
    }, 2000);
}

// Fungsi untuk memperbarui tampilan antrian
function updateQueueDisplay() {
    const queueList = document.getElementById('queueList');
    queueList.innerHTML = '<h3>Antrian Saat Ini:</h3>';
    if (processes.length === 0) {
        queueList.innerHTML += '<p class="error">Antrian kosong.</p>';
        return;
    }
    processes.forEach((proc, index) => {
        queueList.innerHTML += `<p>Proses ${proc.name}: ${proc.burstTime} ms</p>`;
    });
}

// Fungsi untuk menjalankan simulasi
function runSimulation(method) {
    if (processes.length === 0) {
        document.getElementById('resultBody').innerHTML = '';
        document.getElementById('summary').innerHTML = '<p class="error">Tidak ada proses dalam antrian!</p>';
        return;
    }

    const resultBody = document.getElementById('resultBody');
    const summary = document.getElementById('summary');
    const ganttChart = document.getElementById('ganttChart');
    const loading = document.getElementById('loading');

    // Tampilkan loading
    loading.style.display = 'block';
    resultBody.innerHTML = '';
    summary.innerHTML = '';
    ganttChart.innerHTML = '';

    // Simulasi dengan delay untuk efek loading
    setTimeout(() => {
        let sortedProcesses = [...processes];
        if (method === 'SJF') {
            sortedProcesses.sort((a, b) => a.burstTime - b.burstTime);
        }

        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;

        // Generate Gantt Chart
        ganttChart.innerHTML = `<h3>Gantt Chart (${method}):</h3>`;
        sortedProcesses.forEach((proc) => {
            const width = proc.burstTime * 20; // Skala visual
            ganttChart.innerHTML += `<div class="gantt-block" style="width: ${width}px; background-color: #${Math.floor(Math.random()*16777215).toString(16)}">${proc.name} (${currentTime}-${currentTime + proc.burstTime})</div>`;
            const waitingTime = currentTime;
            const turnaroundTime = currentTime + proc.burstTime;
            totalWaitingTime += waitingTime;
            totalTurnaroundTime += turnaroundTime;

            // Tambahkan ke tabel
            resultBody.innerHTML += `
                <tr>
                    <td>${proc.name}</td>
                    <td>${proc.burstTime}</td>
                    <td>${waitingTime}</td>
                    <td>${turnaroundTime}</td>
                </tr>
            `;
            currentTime += proc.burstTime;

        });
        // Tampilkan rata-rata
        const avgWaitingTime = (totalWaitingTime / processes.length).toFixed(2);
        const avgTurnaroundTime = (totalTurnaroundTime / processes.length).toFixed(2);
        summary.innerHTML = `
            <p class="success">Rata-rata Waiting Time: ${avgWaitingTime} ms</p>
            <p class="success">Rata-rata Turnaround Time: ${avgTurnaroundTime} ms</p>
        `;

        // Sembunyikan loading
        loading.style.display = 'none';
    }, 1000); // Delay 1 detik untuk efek loading
}

// Event listener untuk fokus otomatis
document.getElementById('processName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('burstTime').focus();
    }
});

document.getElementById('burstTime').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addProcess();
    }
});