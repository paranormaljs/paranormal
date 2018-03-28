// @flow
import Runner from './Runner';

export type ParanormalOptions = {
  cwd: string,
  match: Array<string>,
  watch: boolean,
};

export default async function paranormal(opts: ParanormalOptions) {
  let { cwd, match, watch } = opts;
  let runner = new Runner({ cwd });
  await runner.run({ match, watch });
}
