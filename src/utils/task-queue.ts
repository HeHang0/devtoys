export class TaskQueue {
  private concurrency: number;
  private running: number;
  private queue: Function[];
  constructor(concurrency: number) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  pushTask(task: Function) {
    this.queue.push(task);
    this.next();
  }

  next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task &&
        task().then(() => {
          this.running--;
          this.next();
        });
      this.running++;
    }
  }
}
