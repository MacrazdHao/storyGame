# 介绍

首先，我们感谢你下载了这本书。

我们将用10个章节来引导你以ES6+的Javascript为基础，使用Phaser3来写一个HTML5游戏。

这个游戏的玩法将会设定为类似于涂鸦跳跃(Doodle Jump)的无限跳跃玩法。

具体规则是你的游戏角色需要尽可能地通过从上往下不断出现的平台向上跳跃，而这些平台则会在他们到达屏幕最底部时消失。

当你掉落到屏幕底部时，则会视为死亡。噢，我的老天爷，当然不是在说你，是你的角色。你当然可以不断重新开始游戏。

## 为什么选择Web端而不是Unity？

Phaser3是一款非常不错的游戏框架，初学者不但能够快速入门，也足够让开发者实现能想象到的几乎所有2D游戏。

Web端和ES6+的JavaScript是很理想的开发平台和适合初学者入门的语言。

虽然我也曾想过要不要写一本Unity入门书，但可惜它并不如前者那样。它的客户端像机场一样巨大得让人害怕。你肯定认为这个集成了一大堆东西的开发环境都能用得上，但显然，它不是。

在这本书里，你需要的顶多仅仅是一个代码编辑器(本文使用的是Visual Studio Code)，其他的则是最基础的浏览器(本文推荐Chrome)和网络。

## 为什么选择ES6+？

ES6+的语法结构、代码风格，随着时间推移，也终将成为JavaScript的常规规范。

且它同时也让JavaScript更易于学习，以及少了很多在使用其他开发语言的开发者看来比较奇怪的语法和操作。

ES6+的JavaScript在作者看来，是实实在在拥有自己的价值的语言。

在不久以前，使用ES6+的Javascript的唯一途径是引入一些配置较为复杂的开发工具。这对于初学者或者新建一个相对应语法的项目的开发者来说十分不友好，也因此产生了大量半途而废的初学者。

但请放心，在这本书里并不需要，也没有这些乱七八糟的工具和配置。

## 怎么使用这本入门书？

这本书将会引导你阅读，并手把手地从教你把游戏开始创建直到完成。

因此这本书其实并不容易跳着阅读或者随手查哪些特定内容。

每一个章节的设计，都是紧随于上一个章节的，随着内容的推进，难度也会逐步上升。

这也不是一本教你怎么用ES6+的JavaScript的书。

因此我们希望你在此之前能够拥有JavaScript语言的知识基础，相关基础知识你也可以先去Codecademy、Udemy学习一些简单的课程来进行了解。

除此之外，也请放心，任何有关代码和游戏开发的概念的疑问，我们都会在书中一一解释。

我们的目标是让你在学习时不会感到难受，相反，我们更倾向于让你乐在其中，甚至希望你能在跟随书本进行开发时，加入一些属于你自己的元素或改动。

## 完整的实例代码

你可以在Bunny Jump的Github中获取本书涉及的完整实例代码：

https://github.com/ourcade/infinite-jumper-template-phaser3

注意，这个项目仓库使用了git-lfs，如果你使用git clone命令来拷贝该项目，为保证你能将里面的图片、音频等资源下载下来，请确保你的电脑是否也已经安装了git-lfs。

当然，你也能直接进入该项目的[Releases Section](https://github.com/ourcade/infinite-jumper-template-phaser3/releases)中直接下载包含所有项目内容的zip压缩包：

## 在线学习视频

如果你遇到了阻碍，我们也在Youtube提供了对应[10个章节的视频](https://github.com/ourcade/infinite-jumper-template-phaser3)，你也能在此留言和其他人一起相互讨论。

同时我们也会像你一样尽可能逐章阅读这本书，遇到任何错误或者问题的话也会及时纠正。

你也能在我们的[Youtube频道](http://youtube.com/ourcadehq)或[点击这里](https://www.youtube.com/playlist?list=PLumYWZ2t7CRtojYrBNKu-TSXY5VbTGzIY)找到我们的视频播放列表。

## 更多资源

一旦你能熟练掌握这本书的基础内容，那么你就可以进入到下一步，去试着学习用标准的JavaScript开发工具(如Node.js、NPM等)新建一个项目了。恰巧，我们关于(如何从0开发一个Phaser游戏)[https://www.youtube.com/playlist?list=PLumYWZ2t7CRvdJJ206QarbisxYPAyYwj0]的视频，正是为你的下一步而准备的。

在视频中，我们将会从创建一个空文件夹开始，然后用VS Code、NPM和一些命令行构建Phaser3项目。

随后，我们建议看一看我们的(知识回顾)[https://www.youtube.com/playlist?list=PLumYWZ2t7CRuhzvpSeCvRLUZv2xKgO_wh]，其中包含了更多你能买到的(进阶文章和课程)[https://gum.co/moEDH]。

---

我们有强烈的意愿来更新和完善这本书。如果有什么错误、不清晰的描述，或者其他任何问题，请通过我们的邮箱tommy@ourcade.co或推特(@ourcadehq)[http://twitter.com/ourcadehq]留言告诉我们。

好了，废话不再多说，我们现在就开始开发我们的游戏吧！

---

***Ourcade是一个为开发者和学者们提供的很有意思的能让你发散思维游戏开发者论坛。***

# 好戏开始

我们会让所有前置准备尽可能地简化。

如果你是已经知道要做什么的Web开发者有，那么你肯定知道有很多的工具让事情变得容易和简单。

实际上，所有的工具都很可能反作用于初学者，把原本不复杂的事情变得更加摸不着头脑。

这本书不会使用Node和NPM，当然我们也不会假设你能够熟练使用命令行。

你只需要一个现代化的浏览器(如Google Chrome)，以及一个代码编辑器(如Visual Studio Code，简称VS Code)。

你还没准备好的话就快去下载吧，在本书中就不再提供这些基本工具的下载地址了，相信对你来说这并不困难。

## 创建一个新建文件夹

我们的游戏代码将会放在一个文件夹内，不介意的话我们可以把它命名为"bunny-jump"，并放在你的电脑的任何地方。噢！桌面就不错。

然后我们再在"bunny-jump"文件夹里面创建一个命名为"src"的文件夹。我们所有的JavaScript代码将会放到这来。

现在，我们打开VS Code，打开"bunny-jump"文件夹。

在创建实际的文件之前，我们还要多做一个步骤。

## Development Server

"Development Server"这词语听起来很高大上，实际上只是一个运行在我们电脑中的一个程序。

在这里，我们将依靠它来运行我们的游戏。

我们会简单地在VS Code中使用"Live Server"插件来完成这一步骤。

在VS Code窗口中，我们点击最左侧菜单的图标为四个小方块的按钮，这个就是VS Code的插件商城，在里面你可以输入"Live Server"进行搜索，找到标注作者为"Ritwick Dey"的"Live Server"后点击安装，然后稍等片刻。

安装完成后，你就能在VS Code窗口底部状态栏的右下角看到一个新增的"Go Live"按钮。

当然，你也可以用VS Code的组合快捷键(Shift + Cmd / Ctrl + P)换起命令行窗口，输入"Live Server"查看它的所有Live Server命令行。

在这里，我们只需要使用"Open with Live Server"命令，或点击"Go Live"按钮就能开启一个Development Server了。