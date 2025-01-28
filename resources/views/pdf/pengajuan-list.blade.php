<!DOCTYPE html>
<html>
<head>
    <title>Daftar Pengajuan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .status-pending {
            color: #b45309;
        }
        .status-approved {
            color: #15803d;
        }
        .status-rejected {
            color: #b91c1c;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Daftar Pengajuan Crowdfunding</h2>
        <p>Dicetak pada: {{ now()->format('d F Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Mahasiswa</th>
                <th>Batch</th>
                <th>Status</th>
                <th>Tanggal Pengajuan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pengajuans as $index => $pengajuan)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $pengajuan->user->name }}</td>
                    <td>{{ $pengajuan->batch->name }}</td>
                    <td class="status-{{ $pengajuan->status }}">
                        {{ ucfirst($pengajuan->status) }}
                    </td>
                    <td>{{ $pengajuan->created_at->format('d/m/Y H:i') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html> 