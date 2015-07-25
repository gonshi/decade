# Readme

- 随時更新しています

## 開発環境
### Grunt

タスクは次のとおりです。実行するときは、`bower タスク名`とします。

##### dev

開発用タスク。

* jshintの実行
* /src/js, /src/top, /src/img以下のファイル群を/.tmp以下にコピー
* jadeのコンパイル
* compass compileを実行
* nodeサーバーの立ち上げ（localhost:9000; ルートディレクトリは/.tmp）
* watch及びlivereload

#### server

nodeサーバーを立ち上げるためのタスクです。初期コンパイルを実行せずに直接サーバーをたちあげたいときに使います。

ルートディレクトリは/.tmpです。

#### test

jsの単体テストを実行します。次の順にタスクを実行します。

* jshint
* karma

また、karmaはspecファイルを監視し続けます。

#### build

production版のファイルを作成します。

#### bi

bowerのヘルパータスクです。bower.jsonに基づいて、/src/js/lib以下にライブラリファイルをコピーします。cleanは実行しません。

### js

- いい感じに運用します。
- libディレクトリ以下へのjsライブラリの導入は、bowerの利用を推奨しています。

### sass

- src/sass: sassファイルを管理しています
- base: reset, function, mixin, 変数などを管理する
 - mixin: mixinはある程度の機能単位ごとにファイルを分けて、必要なモジュールだけロードするようにしています。
 - _function.scss: functionを管理
 - _placeholder.scss: placeholderを管理。extendで呼びます。
 - _reset.scss: html要素のスタイルを初期化します。
 - _value.scss: グローバル変数をここで定義します。


### Jade

- includeファイルはすべて'/jade/include'以下にまとめて管理する
- mixinファイルはすべて'/jade/mixin'以下にまとめて管理する
- markdownをincludeするといい感じにhtmlに変換します。

## 更新履歴

- 2014/06/16 node_moduleを更新
- 2014/02/28 gruntのタスクを修正
