<template>
  <div class="Sudoku">
    <p @click="initData3">生成矩阵</p>
    <div class="rowsBox">
      <div
        v-for="(row, rowIndex) in rows"
        :key="`row-${rowIndex}`"
        class="rowsBox-item"
      >
        <p v-for="(item, index) in row" :key="`rowItem-${index}`">{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script>
const trows = [
  [0, 0, 0, 0, 5, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 1, 3, 4, 0],
  [9, 7, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 4, 0, 0, 7],
  [0, 4, 0, 0, 0, 6, 0, 3, 1],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [6, 0, 0, 0, 0, 0, 0, 9, 0],
  [0, 8, 0, 0, 1, 0, 0, 7, 0],
  [2, 0, 3, 0, 8, 0, 0, 0, 6]
]
// const trows = [
//   [0, 0, 0, 0, 5, 0, 0, 0, 0],
//   [0, 0, 0, 2, 0, 1, 3, 4, 0],
//   [9, 7, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0]
// ]
const tcols = [
  [0, 0, 9, 0, 0, 3, 6, 0, 2],
  [0, 0, 7, 0, 4, 0, 0, 8, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 3],
  [0, 2, 0, 0, 0, 0, 0, 0, 0],
  [5, 0, 0, 0, 0, 0, 0, 1, 8],
  [0, 1, 0, 4, 6, 0, 0, 0, 0],
  [0, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 4, 0, 0, 3, 0, 9, 7, 0],
  [0, 0, 0, 7, 1, 0, 0, 0, 6]
]
const tboxs = [
  [0, 0, 0, 0, 0, 0, 9, 7, 0],
  [0, 5, 0, 2, 0, 1, 0, 0, 0],
  [0, 0, 0, 3, 4, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 0, 3, 0, 0],
  [0, 0, 4, 0, 0, 6, 0, 0, 0],
  [0, 0, 7, 0, 3, 1, 0, 0, 0],
  [6, 0, 0, 0, 8, 0, 2, 0, 3],
  [0, 0, 0, 0, 1, 0, 0, 8, 0],
  [0, 9, 0, 0, 7, 0, 0, 0, 6]
]
export default {
  data() {
    return {
      level: 3,
      rows: [],
      columns: [],
      boxs: [],
      nums: [],
      step: 0
    }
  },
  computed: {},
  mounted() {
    // 基础数字
    this.nums = new Array(this.level * this.level)
      .fill(null)
      .map((item, index) => index + 1)
  },
  methods: {
    // 算法方式
    initData() {
      const rows = new Array(this.level * this.level).fill(0).map(() => [])
      const cols = new Array(this.level * this.level).fill(0).map(() => [])
      const boxs = new Array(this.level * this.level).fill(0).map(() => [])
      const CreateRecord = []
      const CreateIndexRecord = new Array(
        this.level * this.level * this.level * this.level
      )
        .fill(0)
        .map(() => -1)
      let numRowIndex = 0
      let numColIndex = 0
      while (numRowIndex < rows.length) {
        while (numColIndex < cols.length) {
          // rows.forEach((item) => {
          //   console.log(JSON.stringify(item))
          // })
          const step = numColIndex + numRowIndex * (this.level * this.level)
          CreateIndexRecord[step]++
          const recordIndex = CreateIndexRecord[step]
          CreateRecord.length = step + 1
          // box的序号
          const numBoxIndex =
            Math.floor(numRowIndex / this.level) * this.level +
            Math.floor(numColIndex / this.level)
          const canUseNum =
            CreateRecord[step] ||
            this.getDiffNums(
              rows[numRowIndex],
              cols[numColIndex],
              boxs[numBoxIndex]
            )
          this.step = step
          const rowIndex =
            step + 1 - numRowIndex * (this.level * this.level) - 1
          const colIndex = numRowIndex
          const boxIndex =
            (numRowIndex % this.level) * this.level +
            (numColIndex % this.level)
          if (canUseNum.length === 0 || recordIndex >= canUseNum.length) {
            rows[numRowIndex].length = rowIndex
            cols[numColIndex].length = colIndex
            boxs[numBoxIndex].length = boxIndex
            CreateIndexRecord[step] = -1
            // 可用数字用尽  则  返回上一步
            if (numColIndex === 0) {
              // 列序为0，则返回到上一行的最后一列
              numRowIndex -= 2 // 这里-2是因为+1会在后面执行
              numColIndex = this.level * this.level - 1
              break
            }
            if (numColIndex > 0) {
              numColIndex -= 1 // 这里-1是因为后面的+1不会执行
              continue
            }
          }
          if (step >= CreateRecord.length) {
            CreateRecord.push(canUseNum)
          } else {
            CreateRecord[step] = canUseNum
          }
          const num = canUseNum[recordIndex]
          rows[numRowIndex][rowIndex] = num
          cols[numColIndex][colIndex] = num
          boxs[numBoxIndex][boxIndex] = num
          numColIndex++
        }
        if (numColIndex >= cols.length) numColIndex = 0
        numRowIndex++
      }
      this.rows = rows
      this.columns = cols
      this.boxs = boxs
    },
    // 随机数形式
    initData2() {
      const rows = new Array(this.level * this.level)
        .fill(null)
        .map(() => new Set())
      const cols = new Array(this.level * this.level)
        .fill(null)
        .map(() => new Set())
      const boxs = new Array(this.level * this.level)
        .fill(null)
        .map(() => new Set())
      for (
        let numRowIndex = 0;
        numRowIndex < this.level * this.level;
        numRowIndex++
      ) {
        for (
          let numColIndex = 0;
          numColIndex < this.level * this.level;
          numColIndex++
        ) {
          // box的序号
          const numBoxIndex =
            Math.floor(numRowIndex / this.level) * this.level +
            Math.floor(numColIndex / this.level)
          const canUseNum = this.getDiffNums(
            rows[numRowIndex],
            cols[numColIndex],
            boxs[numBoxIndex]
          )
          if (canUseNum.length === 0) break
          const RanIndex = Math.floor(Math.random() * canUseNum.length)
          const num = canUseNum[RanIndex]
          rows[numRowIndex].add(num)
          cols[numColIndex].add(num)
          boxs[numBoxIndex].add(num)
        }
      }
      for (let i = 0; i < rows.length; i++) {
        if ([...rows[i]].length < 9) {
          this.initData2()
          return
        }
      }
      this.rows = rows
      this.columns = cols
      this.boxs = boxs
    },
    // 随机数形式
    initData4() {
      const rows = new Array(this.level * this.level)
        .fill(null)
        .map(() => new Set())
      const cols = new Array(this.level * this.level)
        .fill(null)
        .map(() => new Set())
      const boxs = new Array(this.level * this.level)
        .fill(null)
        .map(() => new Set())
      for (
        let numRowIndex = 0;
        numRowIndex < this.level * this.level;
        numRowIndex++
      ) {
        for (
          let numColIndex = 0;
          numColIndex < this.level * this.level;
          numColIndex++
        ) {
          // box的序号
          const numBoxIndex =
            Math.floor(numRowIndex / this.level) * this.level +
            Math.floor(numColIndex / this.level)
          const canUseNum = this.getDiffNums(
            rows[numRowIndex],
            cols[numColIndex],
            boxs[numBoxIndex]
          )
          if (canUseNum.length === 0) break
          const staticNum = trows[numRowIndex][rows[numRowIndex].size]
          // console.log(numRowIndex, rows[numRowIndex].size, staticNum)
          if (staticNum && canUseNum.includes(staticNum)) {
            rows[numRowIndex].add(staticNum)
            cols[numColIndex].add(staticNum)
            boxs[numBoxIndex].add(staticNum)
            continue
          } else if (staticNum && !canUseNum.includes(staticNum)) break
          const RanIndex = Math.floor(Math.random() * canUseNum.length)
          const num = canUseNum[RanIndex]
          rows[numRowIndex].add(num)
          cols[numColIndex].add(num)
          boxs[numBoxIndex].add(num)
        }
      }
      for (let i = 0; i < rows.length; i++) {
        if ([...rows[i]].length < 9) {
          this.initData3()
          return
        }
      }
      this.rows = rows
      this.columns = cols
      this.boxs = boxs
    },
    initData3() {
      const rows = new Array(this.level * this.level).fill(0).map(() => [])
      const cols = new Array(this.level * this.level).fill(0).map(() => [])
      const boxs = new Array(this.level * this.level).fill(0).map(() => [])
      const CreateRecord = []
      const CreateIndexRecord = new Array(
        this.level * this.level * this.level * this.level
      )
        .fill(0)
        .map(() => -1)
      let numRowIndex = 0
      let numColIndex = 0
      while (numRowIndex < rows.length) {
        while (numColIndex < cols.length) {
          const step = numColIndex + numRowIndex * (this.level * this.level)
          CreateIndexRecord[step]++
          const recordIndex = CreateIndexRecord[step]
          CreateRecord.length = step + 1
          // box的序号
          const numBoxIndex =
            Math.floor(numRowIndex / this.level) * this.level +
            Math.floor(numColIndex / this.level)
          const rowIndex =
            step + 1 - numRowIndex * (this.level * this.level) - 1
          const colIndex = numRowIndex
          const boxIndex =
            (numRowIndex % this.level) * this.level +
            (numColIndex % this.level)
          let canUseNum =
            CreateRecord[step] ||
            this.getDiffNums(
              rows[numRowIndex],
              cols[numColIndex],
              boxs[numBoxIndex]
            )
          const staticNum = trows[numRowIndex][rowIndex]
          const staticIndex = canUseNum.indexOf(staticNum)
          if (staticNum && staticIndex > -1 && !CreateRecord[step]) {
            const tmp = canUseNum[staticIndex]
            canUseNum[staticIndex] = staticNum
            canUseNum[0] = tmp
          }
          this.step = step
          if (canUseNum.length === 0 || recordIndex >= canUseNum.length) {
            rows[numRowIndex].length = rowIndex
            cols[numColIndex].length = colIndex
            boxs[numBoxIndex].length = boxIndex
            CreateIndexRecord[step] = -1
            // 可用数字用尽  则  返回上一步
            if (numColIndex === 0) {
              // 列序为0，则返回到上一行的最后一列
              numRowIndex -= 2 // 这里-2是因为+1会在后面执行
              numColIndex = this.level * this.level - 1
              break
            }
            if (numColIndex > 0) {
              numColIndex -= 1 // 这里-1是因为后面的+1不会执行
              continue
            }
          }
          if (step >= CreateRecord.length) {
            CreateRecord.push(canUseNum)
          } else {
            CreateRecord[step] = canUseNum
          }
          const num = canUseNum[recordIndex]
          rows[numRowIndex][rowIndex] = num
          cols[numColIndex][colIndex] = num
          boxs[numBoxIndex][boxIndex] = num
          numColIndex++
        }
        if (numColIndex >= cols.length) numColIndex = 0
        numRowIndex++
      }
      this.rows = rows
      this.columns = cols
      this.boxs = boxs
    },
    getDiffNums(a, b, c) {
      // a∪b∪c
      const union = new Set([...a, ...b, ...c])
      // 差集
      return [...this.nums]
        .filter((x) => !union.has(x))
        .sort(() => {
          return 0.5 - Math.random()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.Sudoku {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .rowsBox {
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    &-item {
      width: fit-content;
      display: flex;
      flex-direction: row;
      p {
        width: 20px;
        height: 20px;
        line-height: 20px;
      }
    }
  }
}
</style>
