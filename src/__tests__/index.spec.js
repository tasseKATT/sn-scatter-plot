describe('scatter-plot supernova', () => {
  const sandbox = sinon.createSandbox();
  let supernova;
  let env;
  let qae;
  let hooks;
  before(() => {
    env = {
      flags: [],
    };
    hooks = {
      default: {
        useCore: sandbox.stub(),
      },
      useCore: sandbox.stub(),
      useModels: sandbox.stub(),
      useSettings: sandbox.stub(),
      useRender: sandbox.stub(),
      useResize: sandbox.stub(),
    };
    qae = sandbox.stub();

    [{ default: supernova }] = aw.mock(
      [
        ['**/qae/index.js', () => qae],
        ['**/hooks/index.js', () => hooks],
      ],
      ['../index']
    );
    const scatterplot = supernova(env);
    scatterplot.component();
  });
  after(() => {
    sandbox.reset();
  });

  it('should call qae', () => {
    expect(qae).to.have.been.calledWithExactly(env);
  });

  it('should call all hooks', () => {
    expect(hooks.useCore, 'useCore').to.have.been.calledOnce;
    expect(hooks.useModels).to.have.been.calledOnce;
    expect(hooks.useSettings).to.have.been.calledOnce;
    expect(hooks.useRender).to.have.been.calledOnce;
    expect(hooks.useRender).to.have.been.calledOnce;
  });
});
