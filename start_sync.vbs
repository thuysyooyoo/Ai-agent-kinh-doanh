Set FSO = CreateObject("Scripting.FileSystemObject")
scriptDir = FSO.GetParentFolderName(WScript.ScriptFullName)
psScript = scriptDir & "\scripts\auto_sync.ps1"

Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "powershell.exe -ExecutionPolicy Bypass -File """ & psScript & """", 0, False

MsgBox "He thong tu dong dong bo da duoc khoi chay ngam!" & vbCrLf & "Du an se tu dong day len GitHub sau moi 1 phut khi co thay doi.", 64, "GitHub Auto-Sync"
