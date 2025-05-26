# 执行前：chmod +x build_deploy.sh
# 密码是 Admin111.. （注意后面是2个点）
pnpm run build
ssh root@114.215.205.114 "cd /www/wwwroot/afc.prd.rxqin.com/ && rm -rf assets index.html h5/* "
scp -r ../dist/*  root@114.215.205.114:/www/wwwroot/afc.prd.rxqin.com/
scp -r ../dist/*  root@114.215.205.114:/www/wwwroot/afc.prd.rxqin.com/h5/
