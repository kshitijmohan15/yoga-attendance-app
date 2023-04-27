docker-compose build

docker tag t3-app 831893652299.dkr.ecr.ap-northeast-1.amazonaws.com/attendance-next-tokyo

aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 831893652299.dkr.ecr.ap-northeast-1.amazonaws.com/attendance-next-tokyo

