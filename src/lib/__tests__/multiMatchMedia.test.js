import { multiMatchMedia } from '../multiMatchMedia';

jest.useFakeTimers();

const makeMockedMatchMedia = matches => ({
  matches,
  addListener(cb) {
    setTimeout(() => {
      cb({ matches: !this.matches }); // eslint-disable-line
    }, 0);
  },
  removeListener: () => {},
});

describe('multiMatchMedia', () => {
  const originalMatchMedia = window.matchMedia;
  let multiMatchMediaInstance;

  beforeEach(() => {
    window.matchMedia = jest.fn();
    window.matchMedia
      .mockReturnValueOnce(makeMockedMatchMedia(true))
      .mockReturnValueOnce(makeMockedMatchMedia(false));

    multiMatchMediaInstance = multiMatchMedia(
      {
        xs: '(max-width: 378px)',
        sm: '(min-width: 379px)',
      },
      150
    );
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  describe('matches', () => {
    it('has matches object with the media queries results', () => {
      expect(multiMatchMediaInstance.matches).toEqual({
        xs: true,
        sm: false,
      });
    });
  });

  describe('subscribe', () => {
    it('subscribes a callback', () => {
      expect.assertions(3);

      const callback = jest.fn();
      multiMatchMediaInstance.subscribe(callback);

      expect(callback).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        matches: { xs: false, sm: true },
      });
    });

    it('subscribe only one function', () => {
      expect.assertions(2);

      const firstCallback = jest.fn();
      const secondCallback = jest.fn();

      multiMatchMediaInstance.subscribe(firstCallback);
      multiMatchMediaInstance.subscribe(secondCallback);

      jest.runAllTimers();

      expect(firstCallback).not.toHaveBeenCalled();
      expect(secondCallback).toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('does not call the callback', () => {
      expect.assertions(2);

      const callback = jest.fn();
      multiMatchMediaInstance.subscribe(callback);
      multiMatchMediaInstance.unsubscribe(callback);

      expect(callback).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
