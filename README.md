<p align="center"> 
    <img width="200"  src="https://github.com/Ingenious-c0der/RustyVault/assets/76046349/c3cc0f15-11b4-4d82-844c-afde4d8e60dc" />
</p>
<p align="center"> 
    <img width="800"  src="https://github.com/Ingenious-c0der/RustyVault/assets/76046349/7b119fb3-aca3-4372-9569-a68cf4752294" />
</p>

# RustyVault

### Your local & secure password manager !

RustyVault is a password manager that stores your passwords locally on your computer. It is written in Rust and uses the Tauri framework to create a cross-platform desktop application. The frontend is written in Next.js and the backend is written in Rust. Strong encryption is provided using local 256 bit key gen and AES-256/RSA encryption.

The application is still under development, daily/weekly updates will be pushed to the repository. The release will be created as soon as the basic targetted features are implemented.

Rusty Vault is designed to be secure, fast , clean and easy to use.

find more detailed documentation [here](documentation.md)


## First Release is very close, stay tuned !
#### Changes pending before v1 launch
- fix/standardize vault images
- fuse edit and delete vault functions
- fix styling issues
- enter password twice for verification at each stage -done
- Do not allow vault name clashes
- code cleanup
- packaging and final tests


# TODOs : (open for contributions on the following)


## 1.Add a vault cluster to view bucket vaults into different categories
    this would require adding a group id to each vault 
    by default it would go in the base vault group unless specified 
    the vault cluster names wil be visible in the side pane of the application 
    and clicking on it you can view the vaults in that cluster


## 2.Give an option to store as many additional key value pairs
    Could be done Serializing the object containing key-value pairs and storing it in the db. 
    OR
    Could be done by storing the key-value pairs in a separate table and linking it to the vault id




## 3.Add fingerprint id or sec questions (try to eliminate passwords as much as possible without compromising ease of use)
    modify login form to create a homogeneous key which can be etched instead of solid pass. 
    [captcha password? store user pattern instead of password?]


## 4.Extend to mobile devices with bluetooth connectivity
    add bluetooth connectivity to the application to allow for mobile devices to connect to the application
    and transfer/sync user vaults.
    auth with fingerprint id/ OTP 

## 5.Auto filling of password fields 
    add a feature to auto fill password fields on websites 
    [this would require a browser extension]


## 6. Shoot emails to user on login attempts
    add a feature to send an email to the user on login attempts 
    [this would require a mail server to be setup]


## 7. Restore vaults if master password is lost.

## Archive deleted vaults, never really delete vaults unless 2FA'ed by user




