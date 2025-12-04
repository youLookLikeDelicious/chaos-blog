---
author: "你好像很好吃"
title: "Flutter StatefulWidget 和 StatelessWidget"
date: "2025-11-11"
summary: "在 Flutter 中，状态（State）指的是影响 UI 展示的数据或信息，这些数据可能会随时间、用户交互或外部事件（如网络请求）发生变化，而当状态变化时，UI 会相应地更新 以反映最新的状态。"
tags: ["Flutter"]
series: ["Flutter"]
ShowToc: true
weight: 1
TocOpen: true
---

在 Flutter 中，**状态（State） 指的是影响 UI 展示的数据或信息**，这些数据可能会随时间、用户交互或外部事件（如网络请求）发生变化，而当状态变化时，UI 会相应地更新 以反映最新的状态。
# StatelessWidget
StatelessWidget 如其名，是没有状态的组件。一旦创建，它的所有属性（final 修饰）就固定不变了。它无法随着时间的推移改变自身的外观。它只能根据其父组件传递过来的初始配置信息来渲染自己。Padding, Text, and Icon 等都是StatelessWidget
## 生命周期
非常简单，只有一个 build 方法。
1. 构造 (Constructor): 接收父组件传递过来的参数（通常通过 Key 和 @required 参数）。
2. 构建 (build): 描述如何根据自身的配置信息来构建用户界面。每当父组件重建导致传入的参数变化，或者 InheritedWidget 它依赖的数据变化时，build 方法就会被调用。
```Dart
import 'package:flutter/material.dart';

class MyStatelessButton extends StatelessWidget {
  // 这些属性必须是final的，因为Widget不可变
  final String buttonText;
  final Color backgroundColor;

  // 构造函数接收这些配置
  const MyStatelessButton({
    Key? key,
    required this.buttonText,
    this.backgroundColor = Colors.blue,
  }) : super(key: key);

  // 必须重写build方法
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        // 点击后可以做事情（比如调用传入的函数），
        // 但不能改变自身的buttonText或backgroundColor
        print('Button Pressed!');
      },
      style: ElevatedButton.styleFrom(backgroundColor: backgroundColor),
      child: Text(buttonText), // 渲染完全依赖于外部传入的配置
    );
  }
}
```
## 典型使用场景
- 纯展示性的静态文本（Text, Icon）
- 按钮（ElevatedButton, TextButton）等，但其外观和行为由父组件控制
- 图片（Image）
- 任何不需要内部管理变化数据的UI组件
# StatefulWidget
StatefulWidget 拥有内部可变状态（State 对象），当状态变化时（通过 setState()），UI 会自动重新构建。
## 生命周期
|     |    |    |
| ---- |---- |---- |
|生命周期方法|调用次数|描述|
|  StatefulWidget 构造函数  |多次  |创建不可变的Widget配置。|
|  State.createState  |1次  |StatefulWidget 的方法，用于创建对应的 State 对象。|
|  State.initState  |1次  |插入Widget树时立即调用。只调用一次，用于初始化依赖于BuildContext的数据或订阅流（Stream）。|
|  State.didChangeDependencies  |多次  |在 initState 后立即调用一次；后续当依赖的InheritedWidget（如Provider、Theme）发生变化时也会触发。|
|  State.build  |多次  |必须实现。每当状态改变（setState）或依赖变化时都会调用，用于构建UI。|
|  State.didUpdateWidget  |多次  |当父组件重建并传入一个新的 Widget 配置时调用。简单说父组件传递给子组件的参数（widget 的属性）变化时，新旧 widget 通过 == 比较为 “不相等”，此时会触发该方法。|
|  State.setState  |多次  |这不是生命周期方法，而是关键方法。你调用它来通知框架状态已改变，需要重新构建。|
|  State.deactivate  |多次  |当 State 对象从树中暂时移除时调用（比如页面路由切换）。|
|  State.dispose  |1次  |当 State 对象被永久从树中移除时调用。必须在这里释放所有资源，如取消计时器、关闭流等，防止内存泄漏。|

## didUpdateWidget Example
```TypeScript
class _TypingIndicatorState extends State<TypingIndicator>
    with TickerProviderStateMixin {
  late AnimationController _appearanceController;
  late Animation<double> _indicatorSpaceAnimation;

  @override
  void initState() {
    super.initState();

    _appearanceController = AnimationController(vsync: this);

    _indicatorSpaceAnimation = CurvedAnimation(
      parent: _appearanceController,
      curve: const Interval(0.0, 0.4, curve: Curves.easeOut),
      reverseCurve: const Interval(0.0, 1.0, curve: Curves.easeOut),
    ).drive(Tween<double>(begin: 0.0, end: 60.0));

    if (widget.showIndicator) {
      _showIndicator();
    }
  }

  @override
  void didUpdateWidget(TypingIndicator oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (widget.showIndicator != oldWidget.showIndicator) {
      if (widget.showIndicator) {
        _showIndicator();
      } else {
        _hideIndicator();
      }
    }
  }

  @override
  void dispose() {
    _appearanceController.dispose();
    super.dispose();
  }

  void _showIndicator() {
    _appearanceController
      ..duration = const Duration(milliseconds: 750)
      ..forward();
  }

  void _hideIndicator() {
    _appearanceController
      ..duration = const Duration(milliseconds: 150)
      ..reverse();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _indicatorSpaceAnimation,
      builder: (context, child) {
        return SizedBox(height: _indicatorSpaceAnimation.value);
      },
    );
  }
}
```
## 典型使用场景
- 任何需要管理动态数据的界面（如计数器、购物车数量）
- 用户交互反馈（如动画、展开/收起面板、文本输入框）
- 需要监听实时数据流（如网络请求、传感器数据、WebSocket消息）的组件
- 表单校验

```Dart
class MyCounter extends StatefulWidget {
  const MyCounter({super.key});

  @override
  State<MyCounter> createState() => _MyCounterState();
}

class _MyCounterState extends State<MyCounter> {
  int count = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $count'),
        TextButton(
          onPressed: () {
            setState(() {
              count++;
            });
          },
          child: Text('Increment'),
        )
      ],
    );
  }
}
```
## 深入理解
- StatefulWidget 是易逝的（Ephemeral）：和所有 Widget 一样，StatefulWidget 是不可变的。每当父组件重建或因屏幕刷新需要更新 UI 时，整个 StatefulWidget 实例（或其子树）都会被销毁并重新创建。它的生命周期非常短暂。
- State 对象是持久的（Persistent）：而 State 对象则不同。框架会设法在多次 build 过程中保留和复用同一个 State 对象。这是状态得以保持的关键！如果状态随着 Widget 一起被销毁，那它就毫无意义。
## 🧐Flutter在每次setState之后, 会重新构建Widget, 状态是如何保存的
Flutter 重新创建的是 **Widget 对象**，但不会销毁对应的 **Element 和 State 实例**。换句话说, Widget 是一次性的、不可变的, **State 是持久的，由 Element 管理并复用的**。
#### State 的创建和保存机制
flutter第一次构建statefulWidget时, 构造函数会实例化state #源码
```Dart
class StatefulElement extends ComponentElement {
    StatefulElement(StatefulWidget widget) : _state = widget.createState(), super(widget) {
    }
}
```
当调用 setState() 时：
1. Flutter 会标记该 Element 为 **需要重建**；
2. 调用 build()，重新创建一个新的 Widget 实例；
3. Flutter 检查：
- Widget 的 **runtimeType** 是否相同；
- Widget 的 **key** 是否相同；
1. 如果相同 ✅：
- Flutter **复用现有的 Element 和 State 对象**；
- 仅用新 Widget 替换掉旧的 Widget 引用；
- 调用 build() 更新 UI
举例说明
```Dart
class Counter extends StatefulWidget {
  const Counter({super.key});

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $count'),
        ElevatedButton(
          onPressed: () => setState(() => count++),
          child: const Text('Add'),
        ),
      ],
    );
  }
}
```
首次渲染：
- 创建 _CounterState
- 调用 build() 渲染
 点击按钮触发 setState：
- _CounterState 仍然是同一个对象；
- 仅 Widget 重建；
- 新 Widget 替换旧 Widget 引用；
- 调用 _CounterState.build()；
- count 值仍然保留。
