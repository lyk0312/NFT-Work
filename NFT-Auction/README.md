# NFT-Auction
NFT拍卖平台

### 操作说明

**启动**：

下载程序后，在终端输入

``` 
npm install
npm start
```

即可在”http://localhost:3000/“访问到操作页面；



**页面说明：**

导航栏中显示当前钱包：

![image-20211106122629654](C:\Users\acer\AppData\Roaming\Typora\typora-user-images\image-20211106122629654.png)

操作按钮显示拍卖平台的功能（目前只实现了出售图片的功能）：

<img src="C:\Users\acer\AppData\Roaming\Typora\typora-user-images\image-20211106123119159.png" alt="image-20211106123119159" style="zoom:50%;" />



添加拍卖图片：

选择想要拍卖的图片后，点击提交，将在下方显示图片的IPFS CID，这将是后面交易中商品的信息且唯一；

<img src="C:\Users\acer\AppData\Roaming\Typora\typora-user-images\image-20211106123209022.png" alt="image-20211106123209022" style="zoom:50%;" />



输入价格：

输入初始定价和最小增长价格后点击提交，将出现钱包的交易响应，扣除所需的gas费用。

<img src="C:\Users\acer\AppData\Roaming\Typora\typora-user-images\image-20211106123359324.png" alt="image-20211106123359324" style="zoom:50%;" />





查看交易信息：

在拍卖人次序中输入整数（如"1")，点击“详情”，将出现当前图片的流转信息，包括拍卖人出价和当前最高出价。

<img src="C:\Users\acer\AppData\Roaming\Typora\typora-user-images\image-20211106123658279.png" alt="image-20211106123658279" style="zoom:50%;" />



进行拍卖时，用户的资金被添加到他们的存款和地址的映射中。 widhrawl函数只能在拍卖被取消时调用。 每个用户调用widhrawl函数来提取自己的资金：当出价小于当前最高出价时将会被退回。

当拍卖者选择“结束拍卖”时拍卖停止，拍卖人与最高出价者进行交易。

### 运行结果

<img src="C:\Users\acer\AppData\Roaming\Typora\typora-user-images\image-20211106130005094.png" alt="image-20211106130005094" style="zoom:80%;" />

