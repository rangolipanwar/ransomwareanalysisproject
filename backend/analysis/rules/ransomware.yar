rule Ransomware_Encryption {
    strings:
        $encrypt1 = "CryptEncrypt" nocase
        $encrypt2 = "CryptDecrypt" nocase
        $encrypt3 = "AES" nocase
        $encrypt4 = "RSA" nocase
        $encrypt5 = "CryptoAPI" nocase
        $encrypt6 = "CryptoServiceProvider" nocase
        
        $ransom1 = "ransom" nocase
        $ransom2 = "payment" nocase
        $ransom3 = "bitcoin" nocase
        $ransom4 = "wallet" nocase
        $ransom5 = "decrypt" nocase
        $ransom6 = "key" nocase
        $ransom7 = "extort" nocase

    condition:
        (2 of ($encrypt*)) or (2 of ($ransom*))
}

rule Ransomware_FileOperations {
    strings:
        $file1 = "CreateFile" nocase
        $file2 = "WriteFile" nocase
        $file3 = "DeleteFile" nocase
        $file4 = "MoveFile" nocase
        $file5 = "CopyFile" nocase

    condition:
        3 of ($file*)
}

rule Ransomware_Network {
    strings:
        $network1 = "socket" nocase
        $network2 = "connect" nocase
        $network3 = "send" nocase
        $network4 = "recv" nocase
        $network5 = "HTTP" nocase

    condition:
        3 of ($network*)
}

rule Ransomware_SystemModification {
    strings:
        $system1 = "RegCreateKey" nocase
        $system2 = "RegSetValue" nocase
        $system3 = "CreateService" nocase
        $system4 = "StartService" nocase
        $system5 = "ShellExecute" nocase

    condition:
        3 of ($system*)
} 