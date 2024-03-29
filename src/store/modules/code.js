const state = {
  fillincode: `#include <iostream>
#include <string>

using namespace std;

class Person {
private:
    int privateData; // 新增的私有属性
public:
    string name;
    int age;
    char gender;
    int* dynamicData; // 新增一个动态分配内存的属性

    // 构造函数
    Person(const string& personName, int personAge, char personGender, int data) {
        name = personName;
        age = personAge;
        gender = personGender;

        // 在堆区动态分配内存,并将 dynamicData 指向这块内存
        dynamicData = new int;
        *dynamicData =(1)_______________;

        // 初始化私有属性
        privateData =(2)_______________;

        cout << "人物已创建" << endl;
    }

    // 析构函数
    ~Person() {
        // 释放动态分配的内存
        delete (3)_______________;
        cout << "人物已销毁" << endl;
    }

    // 拷贝构造函数 - 浅拷贝
    Person(const Person& otherPerson) {
        name = otherPerson.name;
        age = otherPerson.age;
        gender = otherPerson.gender;

        // 浅拷贝 dynamicData,两个对象共享相同的内存
        // 编译器默认实现的拷贝构造函数是浅拷贝,即下面这行代码。
        dynamicData = otherPerson.dynamicData;
        // 调用析构函数时会有错误,因为 dynamicData 指向的是同一块内存,
        // 所以采用深拷贝来解决这一问题：即如果有属性在堆区开辟的,
        // 一定要自己提供拷贝构造函数。防止浅拷贝带来的内存泄漏。
        cout << "浅拷贝构造函数" << endl;

        // 拷贝私有属性
        privateData = otherPerson.(4)_______________;
        cout << "深拷贝构造函数" << endl;
    }

    // 拷贝构造函数 - 深拷贝
    Person(const Person& otherPerson) {
        name = otherPerson.name;
        age = otherPerson.age;
        gender = otherPerson.gender;

        // 深拷贝 dynamicData,分配新的内存并复制数据
        dynamicData = new int;
        *dynamicData = *(otherPerson.(5)_______________);

        cout << "深拷贝构造函数" << endl;
    }

    // 公有方法,用于获取私有属性
    int getPrivateData() const {
        return privateData;
    }
};

int main() {
    // 创建对象,传入动态分配内存的数据
    Person personObject("Alice", 25, 'F', 42, 100);

    // 直接访问对象的属性
    cout << "直接访问对象的属性：" << personObject.name << ", " << (6)_______________ << ", " << personObject.gender << ", " << *(personObject.dynamicData) << ", " << personObject.getPrivateData() << endl;

    // 创建对象指针
    (7)_______________ = new Person("Bob", 30, 'M', 88, 200);

    // 使用对象指针访问对象的属性
    cout << "通过指针访问对象的属性：" << (8)_______________ << ", " << personPointer->age << ", " << personPointer->gender << ", " << *(personPointer->dynamicData) << endl;

    // 浅拷贝
    Person personCopy(personObject);

    // 深拷贝
    Person personDeepCopy = *personPointer;

    // 释放动态分配的内存
    delete personPointer;

    return 0;
}`,
  simulationcode: `#include <iostream>
#include <string>

using namespace std;

class Person {
private:
    int privateData; // 新增的私有属性
public:
    string name;
    int age;
    char gender;
    int* dynamicData; // 新增一个动态分配内存的属性

// 构造函数
Person(const string& personName, int personAge, char personGender, int data) {
    name = personName;
    age = personAge;
    gender = personGender;

    // 在堆区动态分配内存,并将 dynamicData 指向这块内存
    dynamicData = new int;
    *dynamicData = data;

    // 初始化私有属性
    privateData = privateValue;

    cout << "人物已创建" << endl;
}

// 析构函数
~Person() {
    // 释放动态分配的内存
    delete dynamicData;
    cout << "人物已销毁" << endl;
}

// 拷贝构造函数 - 浅拷贝
Person(const Person& otherPerson) {
    name = otherPerson.name;
    age = otherPerson.age;
    gender = otherPerson.gender;

    // 浅拷贝 dynamicData,两个对象共享相同的内存
    //编译器默认实现的拷贝构造函数是浅拷贝,即下面这行代码。
    dynamicData = otherPerson.dynamicData;
    //调用析构函数时会有错误,因为dynamicData指向的是同一块内存,所以采用深拷贝来解决这一问题：即如果有属性在堆区开辟的,一定要自己提供拷贝构造函数。防止浅拷贝带来的内存泄漏。        
    cout << "浅拷贝构造函数" << endl;
    // 拷贝私有属性
    privateData = otherPerson.privateData;
    cout << "深拷贝构造函数" << endl;
}

// 拷贝构造函数 - 深拷贝
Person(const Person& otherPerson) {
    name = otherPerson.name;
    age = otherPerson.age;
    gender = otherPerson.gender;

    // 深拷贝 dynamicData,分配新的内存并复制数据
    dynamicData = new int;
    *dynamicData = *(otherPerson.dynamicData);

    cout << "深拷贝构造函数" << endl;
}

// 公有方法,用于获取私有属性
int getPrivateData() const {
    return privateData;
}
};

int main() {
// 创建对象,传入动态分配内存的数据
Person personObject("Alice", 25, 'F', 42 , 100);

// 直接访问对象的属性
cout << "直接访问对象的属性：" << personObject.name << ", " << personObject.age << ", " << personObject.gender << ", " << *(personObject.dynamicData) << ", " << personObject.getPrivateData() << endl;
// 创建对象指针
Person* personPointer = new Person("Bob", 30, 'M', 88 , 200);

// 使用对象指针访问对象的属性
cout << "通过指针访问对象的属性：" << personPointer->name << ", " << personPointer->age << ", " << personPointer->gender << ", " << *(personPointer->dynamicData) << endl;

// 浅拷贝
Person personCopy(personObject);

// 深拷贝
Person personDeepCopy = *personPointer;

// 释放动态分配的内存
delete personPointer;

return 0;
}
`,
  fillinanswer: [
    'data',
    'data',
    'dynamicData',
    'privateData',
    'dynamicData',
    'personObject.age',
    'Person* personPointer',
    'personPointer->name'
  ],
  fillinexplanation: [
    '这是在构造函数中为 dynamicData 动态分配内存并将其指向该内存的步骤。',
    '私有属性 privateData 在构造函数中被初始化为传入的参数 data。',
    '这是在析构函数中释放动态分配的内存的步骤。',
    '在拷贝构造函数中,私有属性 privateData 被从另一个对象拷贝。',
    '在深拷贝的拷贝构造函数中,dynamicData 被分配新的内存,并复制来自另一个对象的数据。',
    '这是直接访问对象属性 age 的方式。',
    '这是创建指向 Person 对象的指针的声明。',
    '这是使用指针访问对象属性 name 的方式。'
  ]
}
export default {
  namespaced: true,
  state
}
