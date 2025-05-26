scp -r ./nginx.conf root@8.155.0.19:/usr/local/nginx/conf/
ssh root@8.155.0.19 "/usr/local/nginx/sbin/nginx -s reload"
