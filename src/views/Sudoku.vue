<template>
  <div class="Sudoku">
    <p class="button" @click="resetMatrix">重置矩阵</p>
    <p class="button" @click="crackMatrix(true)">破解矩阵(也能生成矩阵)</p>
    <!-- <p class="button" @click="crackMatrix">破解矩阵(所有解)</p> -->
    <p class="button" @click="getMatrix">生成完整矩阵</p>
    <div class="matrixsBox">
      <div class="rowsBox">
        <div
          v-for="(row, rowIndex) in results[0]"
          :key="`trow-${rowIndex}`"
          :class="[
            'rowsBox-item',
            (rowIndex + 1) % level ? '' : 'rowsBox-item--line',
          ]"
        >
          <input
            v-for="(item, index) in row"
            :key="`trowItem-${index}`"
            :class="[
              'rowsBox-item-num',
              trows[rowIndex][index] ? 'rowsBox-item-num--static' : '',
              index % level ? '' : 'rowsBox-item-num--line',
            ]"
            :value="item || ''"
            @input="(e) => inputNum(e.target.value, rowIndex, index)"
          >
        </div>
      </div>
      <div class="rowsBox">
        <div
          v-for="(row, rowIndex) in rows"
          :key="`row-${rowIndex}`"
          :class="[
            'rowsBox-item',
            (rowIndex + 1) % 3 ? '' : 'rowsBox-item--line',
          ]"
        >
          <p
            v-for="(item, index) in row"
            :key="`rowItem-${index}`"
            :class="[
              'rowsBox-item-num',
              index % 3 ? '' : 'rowsBox-item-num--line',
            ]"
          >
            {{ item || "" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const DefaultLevel = 3
const getDefaultMatrix = (level) =>
  new Array(level * level).fill(null).map((item) => {
    return new Array(level * level).fill(0)
  })
export default {
  data() {
    return {
      level: DefaultLevel,
      rows: getDefaultMatrix(DefaultLevel),
      columns: [],
      boxs: [],
      nums: [],
      step: 0,
      trows: getDefaultMatrix(DefaultLevel),
      results: [getDefaultMatrix(DefaultLevel)],
      cracking: false
    }
  },
  computed: {
    MatrixWidth() {
      return this.level * this.level
    },
    tcols() {
      return new Array(this.MatrixWidth).fill(null).map((item, c) => {
        const col = []
        for (let r = 0; r < this.trows.length; r++) {
          col.push(this.trows[r][c])
        }
        return col
      })
    },
    tboxs() {
      return new Array(this.MatrixWidth).fill(null).map((item, b) => {
        const box = []
        for (
          let r = Math.floor(b / this.level) * this.level;
          r < Math.floor(b / this.level) * this.level + this.level;
          r++
        ) {
          for (
            let c = (b % this.level) * this.level;
            c < (b % this.level) * this.level + this.level;
            c++
          ) {
            box.push(this.trows[r][c])
          }
        }
        return box
      })
    }
  },
  mounted() {
    // 基础数字
    this.nums = new Array(this.level * this.level)
      .fill(null)
      .map((item, index) => index + 1)
  },
  methods: {
    resetMatrix() {
      this.trows = getDefaultMatrix(this.level)
      this.results = [getDefaultMatrix(this.level)]
    },
    // 算法方式
    getMatrix() {
      this.rows = []
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
    getMatrix2() {
      this.rows = []
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
          this.getMatrix2()
          return
        }
      }
      this.rows = rows
      this.columns = cols
      this.boxs = boxs
    },
    // 破解方法
    getAnswers(
      single = false,
      r = this.trows,
      c = this.tcols,
      b = this.tboxs,
      numRowIndex = 0,
      numColIndex = 0
    ) {
      if (numRowIndex === this.MatrixWidth) {
        this.results.push(r)
        // console.log(r)
        return r
      }
      const rows = JSON.parse(JSON.stringify(r))
      const cols = JSON.parse(JSON.stringify(c))
      const boxs = JSON.parse(JSON.stringify(b))
      // box的序号
      const numBoxIndex =
        Math.floor(numRowIndex / this.level) * this.level +
        Math.floor(numColIndex / this.level)

      const rowIndex = numColIndex
      const colIndex = numRowIndex
      const boxIndex =
        (numRowIndex % this.level) * this.level + (numColIndex % this.level)
      rows[numRowIndex][rowIndex] = 0
      cols[numColIndex][colIndex] = 0
      boxs[numBoxIndex][boxIndex] = 0
      let canUseNum = this.getDiffNums(
        rows[numRowIndex],
        cols[numColIndex],
        boxs[numBoxIndex]
      )
      if (canUseNum.length === 0) return false
      if (this.trows[numRowIndex][rowIndex]) {
        if (!canUseNum.includes(this.trows[numRowIndex][rowIndex])) {
          return false
        }
        canUseNum = [this.trows[numRowIndex][rowIndex]]
      }
      for (let i = 0; i < canUseNum.length; i++) {
        rows[numRowIndex][rowIndex] = canUseNum[i]
        cols[numColIndex][colIndex] = canUseNum[i]
        boxs[numBoxIndex][boxIndex] = canUseNum[i]
        let result = null
        if (numColIndex + 1 < this.MatrixWidth) {
          result = this.getAnswers(
            single,
            rows,
            cols,
            boxs,
            numRowIndex,
            numColIndex + 1
          )
        } else {
          result = this.getAnswers(
            single,
            rows,
            cols,
            boxs,
            numRowIndex + 1,
            0
          )
        }
        if (single && result) return result
      }
      return false
    },
    // 执行矩阵破解(也能生成矩阵)
    crackMatrix(single = false) {
      if (this.cracking) return
      this.cracking = true
      this.hasStaticNum = true
      this.results = []
      this.getAnswers(single)
      console.log(this.results)
      if (this.results.length === 0) {
        alert('无解')
        this.resetMatrix()
      }
      this.cracking = false
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
    },
    inputNum(val, r, c) {
      const num = val ? parseInt(val) : 0
      const isNum = !isNaN(num)
      let rnum = !isNum || num > 9 ? 0 : num
      if (!isNum) {
        alert(`[${val}]不是数字`)
      }
      const canUseNum = this.getDiffNums(
        this.trows[r],
        this.tcols[c],
        this.tboxs[
          Math.floor(r / this.level) * this.level + Math.floor(c / this.level)
        ]
      )
      if (isNum && !this.nums.includes(num) && num !== 0) {
        alert(`[${val}]不合法${JSON.stringify(this.nums)}`)
        rnum = this.trows[r][c]
      }
      if (rnum !== this.trows[r][c] && rnum && !canUseNum.includes(rnum)) {
        alert(`数字[${rnum}]不符合数独规则${JSON.stringify(canUseNum)}`)
        rnum = 0
      }
      this.$set(
        this.trows,
        r,
        this.trows[r].map((oval, idx) => {
          return idx === c ? rnum : oval
        })
      )
      this.results = [JSON.parse(JSON.stringify(this.trows))]
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
  .button {
    width: fit-content;
    background-color: rgb(179, 179, 179);
    user-select: none;
    cursor: pointer;
  }
  input {
    background: none;
    outline: none;
    border: none;
    margin: 0;
  }
  .matrixsBox {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  .rowsBox + .rowsBox {
    margin-left: 12px;
  }
  .rowsBox {
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    border-right: 2px solid #000;
    border-top: 2px solid #000;
    &-item--line {
      border-bottom: 1px solid #000;
    }
    &-item {
      width: fit-content;
      display: flex;
      flex-direction: row;
      &-num {
        width: 30px;
        height: 30px;
        font-size: 16px;
        line-height: 32px;
        text-align: center;
        border-left: 1px solid #000;
        border-bottom: 1px solid #000;
      }
      &-num--line {
        border-left: 2px solid #000;
      }
      &-num--static {
        font-weight: bold;
        // color: rgb(93, 65, 0);
        // font-size: 14px;
        // text-shadow: 0 0 10px rgb(93, 65, 0);
        background-color: rgb(200, 200, 200);
      }
    }
  }
}
</style>
