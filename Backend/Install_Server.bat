@ECHO OFF 
:checkPrivileges
  NET FILE 1>NUL 2>NUL
    if '%errorlevel%' == '0' ( 
        GOTO PROCCESS
    ) else (       
        color 0C
        echo ========================================
        echo  NEED ADMINISTRATOR TO USE THIS FEATURE
        echo ========================================
        GOTO END
    )

:PROCCESS
echo ======================================
echo SET WINDOWS ENVIRONMENT VARIABLE
echo ======================================
setx /M LG-RESTO "C:\LG Resto"

echo ======================================
echo CONFIGURE NODEJS
echo ======================================
call npm config set prefix "C:\\NodeJS\\npm"
call npm config set cache "C:\\NodeJS\\npm-cache"
call npm config set temp "C:\\NodeJS\\temp"
call npm config ls -l
setx -m PM2_HOME "C:\NodeJS\npm"
setx -m PATH "C:\NodeJS\npm;%PATH%" 

echo ======================================
echo INSTALLING PM2
echo ======================================
call npm install pm2 -g
call npm i pm2-windows-service -g
call npm install -g npm-check-updates
call pm2-service-install -n PM2

echo ======================================
echo INSTALLING WINDOWS SERVICE
echo ======================================
cd C:\NodeJS\npm\node_modules\pm2-windows-service
call ncu inquirer
call ncu inquirer -u
call npm install

echo ======================================
echo CREATING WINDOWS STARTUP SCRIPT
echo ======================================
cd C:\NodeJS\npm\node_modules\pm2-windows-service
call pm2-service-install -n PM2_STARTUP_SCRIPT

echo ======================================
echo RUNNING API-LG-RESTO AS SERVICE
echo ======================================
cd C:\LG RESTO
del .env
copy lg-lan.env_ .env
call pm2 delete API-LG-RESTO
call pm2 start server.js --name "API-LG-RESTO"
call pm2 -f save

GOTO END

:END
pause