import { JsonToStringPipe } from './json-to-string.pipe';

describe('JsonToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new JsonToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
