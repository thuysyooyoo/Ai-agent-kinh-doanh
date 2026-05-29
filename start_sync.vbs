Set FSO = CreateObject("Scripting.FileSystemObject")
scriptDir = FSO.GetParentFolderName(WScript.ScriptFullName)
psScript = scriptDir & "\scripts\auto_sync.ps1"

Set WshShell = CreateObject("WScript.Shell")
' Số 0 có nghĩa là chạy hoàn toàn ẩn dưới nền (Hidden window style)
WshShell.Run "powershell.exe -ExecutionPolicy Bypass -File """ & psScript & """", 0, False

MsgBox "Hệ thống tự động đồng bộ đã được khởi chạy ngầm!" & vbCrLf & "Dự án sẽ tự động đẩy lên GitHub sau mỗi 1 phút khi có thay đổi.", 64, "GitHub Auto-Sync"
