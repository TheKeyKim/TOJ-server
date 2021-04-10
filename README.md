# TOJ 채점 서버
Thekeys judge 백준 클론 사이트를 위한 서버입니다. 로그인과 회원가입, 문제의 정보 가벼오기 및 채점 서버를 포함합니다.

## todo
1. login(done)
2. siginin(done)
3. Get Problem Information(todo)
4. Algorithm Solving Server(todo)

# 문제 채점 로직
request의 body에 코드, problem id, submit id, language code를 담아 요청합니다. 이때 코드에서는 [ ", ', \\ ] 에 대한 전처리를 해주어야 인식이 가능합니다. <br>

0. 서버 내부에서 shell script를 통해 언어에 맞도록 리퀘스트의 바디에 포함된 코드를 컴파일 혹은 인터프리트 합니다.<br>
1. 서버 내부의 인풋 파일의 갯수만큼 코드를 반복적으로 수행합니다. 이것 또한 위와 마찬가지로, shell script를 통해 수행되며, child process를 할당하여 진행합니다. <br>
2. submit id 마다 아웃풋 폴더를 만들어주고, 해당 아웃풋 폴더에 저장된 결과물들을 비교합니다.<br>
3. 일치 여부를 반환합니다. 문제적 허용, 예를 들어 답의 끝에 필요없는 new line이나, 문장의 끝에 불필요한 공백에 대해서는 허용하나, 답안의 중간의 불필요한 공백과 개행은 걸러냅니다.(미완성) <br>
4. 각 유저의 id와 문제 제출 id로 이루어진 db를 통해, 각자의 문제 풀이에 대한 정보를 저장합니다.(미완성)

# USER

## signin
- post
- user/signin
```
{
    email : String,
    password : String,
    login_id : String,
    name : String
}
```

## login
- post
- user/login
```
{
    login_id : String,
    password : String,
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
```
{
    user_id : String,
    problem_id : String
}
```

# PROBLEM

## submit
- post
- problem/submit
- login is needed
```
{
    "id" : Number,
    "problem_id" : Number,
    "language" : Number,
    "code" : String
}
```
(사용예시)
```json
{
    "id" : 1,
    "problem_id" : 1000,
    "language" : 0,
    "code" : "#include<iostream>\nusing namespace std;\nint main(void){\n int a, b;\n cin>>a>>b;\ncout<<a+b<<endl;}\n"
}
```
