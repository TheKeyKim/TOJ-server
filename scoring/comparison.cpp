#include <iostream>
#include <cstdio>

using namespace std;

// comparison [problem_id] [submit_id] [input_id] > output/submit_id.log

string strip(string s){
    int len = s.length();
    while(len > 0 && (s[len-1] == '\n' || s[len-1] == ' ')) len--;
    s.erase(len, s.length());
    return s;
}

int main(int argc, char **argv){
    int ret = 0;
    string problem_id = argv[1];
    string submit_id = argv[2];
    string input_id = argv[3];
    string answer = "./scoring/answer/" + problem_id + "/" + input_id + ".txt";
    string output = "./scoring/output/" + submit_id + "/" + input_id + ".txt";
    string stderr = "./scoring/errlog/" + submit_id + ".log";

    // error check
    FILE* err = fopen(stderr.c_str(), "r");
    char buff[10000];
    if(err) fgets(buff, sizeof(buff), err);
    int n = buff[0];
    if(err && n != 0){
        string s;
        while(fgets(buff, sizeof(buff), err)) s = strip((string) buff);
        printf("6"); //compile error
        return 0;
    }
    FILE* anw = fopen(answer.c_str(), "r");
    FILE* out = fopen(output.c_str(), "r");
    char anw_buff[10000];
    char out_buff[10000];
    string anw_tmp, out_tmp;
    while(fgets(anw_buff, sizeof(anw_buff), anw)){
        if(anw_buff[0] == '\0') break;
        fgets(out_buff, sizeof(out_buff), out);
        anw_tmp = strip((string)anw_buff);
        out_tmp = strip((string)out_buff);
        if(anw_tmp != out_tmp){
            printf("5");
            return 0;
        }
    }
    if(fgets(out_buff, sizeof(out_buff), out) && out_buff[0] != '\0'){
        printf("5");
        return 0;
    }
    printf("2");
}