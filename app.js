'use strict';
const fs = require('fs');
const readline = require('readline');
//import faile FileSystem

const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
//popu-pref.csv ファイルから Stream ファイルを読み込むを生成し、
//さらにそれを readline オブジェクトの input として設定し　rl　オブジェクトを生成している

const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
//集計されたデータを格納する連想配列

rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    //この行数は、引数LineStringで与えられた文字列をカンマ,で分割、それをcolumsという配列にしている
    const year = parseInt(columns[0]);//parseInt(）は文字列を整数値に変換する関数です。
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);//保存したオブジェクトが取得される
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        //連想配列　prefectureDataMap　からデータを取得
        //value　の値が　Falsy　の場合に初期値となるオブジェクトを代入
        //その県のデータを処理するのが初めてであれば、value　の値は　undefined　になるので
        //条件を満たし、value　に値が代入されます。
        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        prefectureDataMap.set(prefecture, value);
        //オブジェクトのプロパティを更新してから、連想配列に保存
    }
});
rl.resume(); //ストリームに情報を流す
//上記のコードは、rlオブジェクトで　line　というイベントが発生したらこの無名関数を呼ぶ

rl.on('close', () => {
    for (let [key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }
    // for-of構文
    //　Mapにfor-ofを使うと、キーと値で要素が２つある配列が前に与えられた変数に代入（分割代入）

    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    //Array.from(prefectureDataMap)の部分で連想配列を普通の配列に変換する処理
    //Array　の　sort　関数を読んで無名関数を渡す
    //sortに対して渡す関数は比較関数
    const rankingStrings = rankingArray.map(([key, value], i ) => {
        return ( i + 1) + '位' + key + ':' + value.popu10 + '=>' + value.popu15 + '変化率:' + value.change;
    });
    console.log(rankingStrings);
});
//’close'イベントは、全ての行を読み込み終わった際に呼び出される
//その際の処理として、各県都道府県各年男女のデータが集計された　Map　オブジェクトを出力

// API
// Application Programming Interface の略称で、
// 応用（アプリケーション）ソフトウェアから利用することが可能なインタフェースのことをいいます。
