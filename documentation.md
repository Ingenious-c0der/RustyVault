# Rusty Vault Backend Implementation Details 
#### Use it only if you feel its secure enough for you and your usecase. First lets address some of the questions that might be in your mind when you are thinking of switching to this password manager. For architecture details, skip to the [architecture](#architecture) section.



## General FAQs 

### How is my master password stored ?
The password hash algorithm currently being used is [Argon2](https://en.wikipedia.org/wiki/Argon2) which is a modern ASIC-resistant and GPU-resistant secure key derivation function.
Unbreakable as of 2023. 
The password is not deported anywhere off your system, rather is stored inside the RustyVault application database in the form of a hash. 



### Does the application have access to my vault passwords (your account passwords)? 
No, for one the application is completely local and open source(no code hiding or stealing is at play).Secondly, the application persists (non-runtime) only fully encrypted and non reversible data representation of your passwords. Without master password, none of the vault passwords can be decrypted, so as of now if you lose your master password, you lose all your vault passwords and there is no backup. (Security comes at its own cost :), but I am thinking of adding a backup email verification feature in such cases which can hold a different auth key to decrypt your vaults, but that would be a feature for the future releases.)

### How is my vault password stored ?
The vault password is first encrypted using a 256 bit key generated from your master password and then stored in the database. The vault password or the key or the master password is not stored in plain text anywhere in the database.

### What if I lose my master password? 
As of now, there is no way to recover your vault passwords if you lose your master password. So, make sure you remember your master password.
In my opinion,human's imagination for passwords is still greater than his static finger print or other biometric patterns. So, lets do this right.

### Is this all false sense of security ?
I am aware that false sense of security is much more dangerous than no security at all.I have analysed each component of the architecture meticulously and there are no obvious loop holes other than breaking the master password with compute power/key loggers. The most secure algorithms available for this type of application (personal-computer) are used.But afterall nothing in this world is unbreakable, so, I am trying to be as transparent as possible with the implementation details. If you feel that there is a security flaw in the application, please raise an issue and I will try to fix it as soon as possible. 

### Is this application prone to steal now and Harvest now,decrypt later attacks ? 
[Educate yourself about this attack](https://en.wikipedia.org/wiki/Harvest_now,_decrypt_later)

Yes, but in theory all useful applications today are. Defending against this type of attack is like trying to fight a non-existent enemy.

### Is this application prone to key loggers ? 
[What is a key logger ?](https://en.wikipedia.org/wiki/Keystroke_logging)

Yes and so are all other things on your device, start with getting an antivirus. 

### Is this application prone to brute force attacks ?
Unless you have a matrioshka brain, no.

### Is this application prone to side channel attacks ?
[What is a side channel attack ?](https://en.wikipedia.org/wiki/Side-channel_attack)

No, the application is not prone to side channel attacks.



# Architecture
![image](https://github.com/Ingenious-c0der/RustyVault/assets/76046349/ea259bfd-46e8-4640-89b1-e40f591fb19d)

The above image shows the overview of the application o address "what is stored where" and "primary interactions". 

## Frontend
For the average user, the frontend is designed to be simple and as flexible as your word document (so that you can finally stop storing your passwords in it and use something safer instead).
Once registered with your master password.Don't forget this master password, there is no way to recover it.
Next, login with your master password and you will be redirected to the homepage, here you will see all your created vaults.The application is designed so that you waste minimum time searching for your passwords, you can either search the vaults by name or scroll to find the vault you are looking for. Once you locate the vault, you have two (buttons) options, either to copy the password to clipboard directly (reccomended) or to view the password in the application itself. More features will be added in the future such as groups to organize your vaults in a better way. But at the core the user journey of quickly entering master password and copying the vault password to clipboard will **never** change.

## Backend

First the inter component interactions are specified and then each component is specified in detail.


### Inter component interactions
*to be completed soon*


### Components / Processes
*to be completed soon*

![mpsvp](https://github.com/Ingenious-c0der/RustyVault/assets/76046349/e8172c3b-11d9-47ea-917e-11a28b98fabf)


![vpdp](https://github.com/Ingenious-c0der/RustyVault/assets/76046349/eea2402b-32f5-4b43-9b7e-5abd33f87f9e)


![ekgp](https://github.com/Ingenious-c0der/RustyVault/assets/76046349/faca9400-8a35-4d6c-b771-fa9978d51410)


![vpep](https://github.com/Ingenious-c0der/RustyVault/assets/76046349/4f94aa78-d910-46bb-8680-cd0e38ed5c43)
















