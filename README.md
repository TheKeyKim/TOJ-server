# TOJ 채점 서버
Thekeys judge 백준 클론 사이트를 위한 서버입니다. 

## todo
1. login(done)
2. siginin(done)
3. Get Problem Information
4. Algorithm Solving Server

# USER

## signin
- post
- user/signin
```json
{
    email : string,
    password : string,
    login_id : string,
    name : string
}
```

## login
- post
- user/login
```json
{
    login_id : string,
    password : string,
}
```

## data
- get
- user/
- login is needed

# SOLVED

## data 
- get
- solved/
- login is needed

## solve the problem
- post
- solved/ 
```json
{
    user_id : string,
    problem_id : string
}
```